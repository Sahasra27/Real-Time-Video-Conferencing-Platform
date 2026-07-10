// webrtcMetrics.js
// Drop-in instrumentation for full-mesh WebRTC apps.
// Measures: (1) per-peer connection setup latency, (2) peak concurrent peers.
// Import once, call onPeerCreated() right after every `new RTCPeerConnection(...)`.

const metrics = {
  createdAt: {},        // socketId -> timestamp when peer was created
  latencies: [],        // completed setup latencies (ms)
  peakPeers: 0,         // highest simultaneous connected-peer count
  connectedPeers: new Set(),

  // Call this immediately after you create a peer connection and store it.
  onPeerCreated(socketId, pc) {
    this.createdAt[socketId] = performance.now();
    console.log(`[metrics] peer created: ${socketId}`);

    pc.addEventListener("connectionstatechange", () => {
      const state = pc.connectionState; // new|connecting|connected|disconnected|failed|closed

      if (state === "connected") {
        const t0 = this.createdAt[socketId];
        if (t0 != null) {
          const ms = performance.now() - t0;
          this.latencies.push(ms);
          console.log(`[metrics] SETUP LATENCY ${socketId}: ${ms.toFixed(0)} ms`);
          delete this.createdAt[socketId];
        }
        this.connectedPeers.add(socketId);
      }

      if (["disconnected", "failed", "closed"].includes(state)) {
        this.connectedPeers.delete(socketId);
      }

      // update peak concurrent peers (each peer = one other participant in mesh)
      if (this.connectedPeers.size > this.peakPeers) {
        this.peakPeers = this.connectedPeers.size;
      }
      console.log(
        `[metrics] ${socketId} -> ${state} | live peers: ${this.connectedPeers.size} | peak: ${this.peakPeers}`
      );
    });
  },

  // Call from the browser console any time: window.webrtcMetrics.report()
  report() {
    const n = this.latencies.length;
    const avg = n ? this.latencies.reduce((a, b) => a + b, 0) / n : 0;
    const min = n ? Math.min(...this.latencies) : 0;
    const max = n ? Math.max(...this.latencies) : 0;
    // peakPeers = other participants; total room size incl. you = peakPeers + 1
    console.table({
      "peak concurrent peers (others)": this.peakPeers,
      "peak room size (incl. you)": this.peakPeers + 1,
      "connections measured": n,
      "avg setup latency (ms)": Math.round(avg),
      "min setup latency (ms)": Math.round(min),
      "max setup latency (ms)": Math.round(max),
    });
    return { peakPeers: this.peakPeers, avg, min, max, n };
  },
};

// expose for console access during testing
if (typeof window !== "undefined") window.webrtcMetrics = metrics;

export default metrics;