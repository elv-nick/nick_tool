export {config};

/* Bitmovin video configuration */
const config = {
  key:
  "0b7164ee-4d3f-4ba3-8baa-fadba8d2f8c3",
  // "ca2a5080-a4ce-41f5-b9db-1272611174bf",
  // 8cbb179d-3e5f-4f59-82a0-6bed9816ade2, eluvio player key
  analytics: {
    key: 'a6f8aca9-4c5b-4a16-84a1-170032a69418',
    // '45adcf9b-8f7c-4e28-91c5-50ba3d4ent42cd4',
    //eluvio analytics key, a6f8aca9-4c5b-4a16-84a1-170032a69418
    videoId: 'stream-test'
  },
  logs: {
    level: "debug"
  },
  adaptation: {
    desktop: {
      limitToPlayerSize: true,
      onVideoAdaptation: (data) => {
        // console.log("adaptation.desktop.onVideoAdaptation", data)
        return data.suggested;
      }
    },
    mobile: {
      limitToPlayerSize: true,
      onVideoAdaptation: (data) => {
        // console.log("adaptation.mobile.onVideoAdaptation", data)
        return data.suggested;
      }
    },
  }
};
