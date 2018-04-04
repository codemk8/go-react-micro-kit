package main

import (
	"encoding/json"
	"flag"
	"net/http"
	"net/http/httputil"
	"net/url"

	"github.com/golang/glog"
)

// Prox is the proxy handler
type Prox struct {
	target *url.URL
	proxy  *httputil.ReverseProxy
}

// New gets a new proxy handler
func New(target string) *Prox {
	url, _ := url.Parse(target)

	return &Prox{target: url, proxy: httputil.NewSingleHostReverseProxy(url)}
}

func (p *Prox) handle(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("X-GoProxy", "GoProxy")
	p.proxy.ServeHTTP(w, r)
}

func otherHandle(w http.ResponseWriter, r *http.Request) {
	// This shows a simple microservice inside the golang server
	// It could also call other services
	list := []string{"Wash up", "Eat some cheese", "Take a nap"}
	js, err := json.Marshal(list)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
	w.Header().Set("Content-Type", "application/json")
	w.Write(js)
	glog.Infof("api call, currently returning a todo list")
	return
}

func main() {
	const (
		defaultPort        = ":1234"
		defaultPortUsage   = "default server port, ':1235', ':8080'..."
		defaultTarget      = "http://127.0.0.1:1235"
		defaultTargetUsage = "default redirect url, 'http://127.0.0.1:1235'"
	)

	// flags
	port := flag.String("port", defaultPort, defaultPortUsage)
	url := flag.String("url", defaultTarget, defaultTargetUsage)

	flag.Parse()

	glog.Infof("server will run on : %s\n", *port)
	glog.Infof("redirecting to :%s\n", *url)

	// proxy
	proxy := New(*url)
	// Serve the root for proxy
	http.HandleFunc("/", proxy.handle)
	// Other microservices
	http.HandleFunc("/api", otherHandle)
	go func() { glog.Error(http.ListenAndServe(*port, nil)) }()
	select {}
}
