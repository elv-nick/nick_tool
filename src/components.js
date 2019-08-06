import {MakeStateChannelToken, MakeTxToken, GenerateUrl, MakeClient,MakeCustomClient,setPlayerEvents, setCharts} from './utils.js';
import {config} from './bitmovin.js'
import React from 'react';
import ReactDOM from 'react-dom';
import 'bootstrap/dist/css/bootstrap.css';
import './styles.css';
import Alert from 'react-bootstrap/Alert'

export {InputForm, VideoForm, Streaming, renderMessage}

class InputForm extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      selectedOption: true,
      privatekey: '',
      block: '',
      libId: '',
      contentId: '',
      hash: '',
      token: 'New token',
      url: 'Newly generated url'
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleScClick = this.handleScClick.bind(this);
    this.handleTxClick = this.handleTxClick.bind(this);
    this.handleOptionChange = this.handleOptionChange.bind(this);
  }

  handleChange(event){
    const target = event.target;

    const value = target.value;
    const name = target.name;

    this.setState({
      [name]: value
    });
  }

  handleOptionChange(event) {

    const val = this.state.selectedOption;

    this.setState({
      selectedOption: !val
    });
  }

  handleScClick(event){
    event.preventDefault();

    if((this.props.client != '') && (typeof this.props.client !== 'undefined')){
      const client = this.props.client;

      const pk = this.state.privatekey;
      const li = this.state.libraryId;
      const ci = this.state.contentId;
      const hash = this.state.hash;


      MakeStateChannelToken(client,
          li,
          ci,
          hash).then(token => {this.setState({token: token});
          });
    }
    /* if client not set */
    else
    {
      //will switch this out for a client-side log
      console.log("CLIENT NOT SET");
    }

  }

  handleTxClick(event){
    event.preventDefault();

    if(this.props.client != '' && (typeof this.props.client !== 'undefined')){
      const client = this.props.client;
      console.log(this.props.client);

      const pk = this.state.privatekey;
      const li = this.state.libraryId;
      const ci = this.state.contentId;
      const hash = this.state.hash;

      MakeTxToken(client,
          li,
          ci,
          hash).then(token => {this.setState({token: token});
          });
    }
    else
    {
      //will switch this out for a client-side log
      console.log("CLIENT NOT SET");
    }
  }

  render() {

    let token = this.state.sctoken;
    let objId = this.state.contentId;
    let client = this.props.client;

    return (

        <div className = "row">
          <div className = "col-sm-12">

          <h2> Generate Token </h2>

            <label>
              Library ID:
              <input className = "form-control" name = 'libId' type="text" value={this.state.libId} onChange={this.handleChange} />
            </label>

            <label>
              Content ID:
              <input className = "form-control" name = 'contentId' type="text" value={this.state.contentId} onChange={this.handleChange} />
            </label>

            <label>
              Hash:
              <input className = "form-control" name = 'hash' type="text" value={this.state.hash} onChange={this.handleChange} />
            </label>

            <button className = "btn btn-outline-secondary btn-sm" onClick={this.handleScClick}>
              Make StateChannel Token
            </button>

            <button className = "btn btn-outline-secondary btn-sm" onClick={this.handleTxClick}>
              Make TxToken
            </button>

          <textarea className = "form-control" value={this.state.token} onChange={this.handleChange}>  </textarea>

              <React.Fragment>

                <VideoForm client = {client} objectId = {objId} />

              </React.Fragment>

        </div>
      </div>
    );
  }

}

/* video selection */
class VideoForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      source: '',
      url: '',
      type:'hls',
      objectId:'',
      token:'',
      versionHash:''
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleClick = this.handleClick.bind(this);
  }

  handleChange(event) {
    if(event.target.name === "versionHash"){
      this.setState({versionHash: event.target.value})
    }
    else{
      this.setState({type: event.target.value});
    }
  }

  handleClick(event) {
    event.preventDefault();

    //if client is set properly
    if(this.props.client != '' && (typeof this.props.client !== 'undefined')){
      const client = this.props.client;
      console.log("video");

      const type = this.state.type;
      const versionHash = this.state.versionHash;

      //get state of the radio/button selector
      GenerateUrl(type, this.props.client, versionHash)
        .then(source => {
          this.setState({source: source});
      });

    }
    //if client is not set
    else{
      console.log("client is not set");
    }

  }

  render() {

    let url = this.state.source[this.state.type];
    let source = this.state.source;
    let client = this.props.client;
    let hash = this.state.versionHash;

    return (
        <div className = "row">
          <div className = "col-sm-12">
            <h2> Streaming Choices </h2>
            <form>
              <label>
                Pick Video Player:
                <select className = "form-control" value={this.state.type} onChange={this.handleChange}>
                  <option value="hls">HLS</option>
                  <option value="dash">Dash</option>
                  <option value="drm">Dash - widevine</option>
                </select>
              </label>

              <label>
                Version Hash:
                <input className = "form-control" name = 'versionHash' type="text" value={this.state.versionHash} onChange={this.handleChange}/>
              </label>

            </form>

            <button className = "btn btn-outline-secondary btn-sm" onClick={this.handleClick}>
              Generate Streaming URL
            </button>

            <div className = "spacing"></div>

            <label>
              video url:
                </label>
              <textarea className = "form-control" name = 'url' type="text" value={url} readOnly> </textarea>

            <React.Fragment>

              <Streaming source = {source} client = {client} versionHash = {hash} />

            </React.Fragment>

          </div>
        </div>
    );
  }
}

class Streaming extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      value: '',
      url: '',
      default: {
        title: "Getting Started with the Bitmovin Player",
        description: "play",
        dash: 'https://bitmovin-a.akamaihd.net/content/MI201109210084_1/mpds/f08e80da-bf1d-4e3d-8899-f0f6155f6efa.mpd',
        poster: 'https://bitmovin-a.akamaihd.net/content/MI201109210084_1/poster.jpg'
        }
    };

    this.initialized = false;
    this.started = false;
    this.destroyed = false;
    this.player = undefined;

    this.InitializePlayer = this.InitializePlayer.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleClick = this.handleClick.bind(this);
    this.LoadPlayer = this.LoadPlayer.bind(this);
  }

  componentWillUnmount() {
    if (this.player) {
      this.player.pause();
      this.player.destroy();
    }

    this.destroyed = true;
  }

  LoadPlayer(){

    if ((this.props.source)==="") {

      console.log("unitialized");
      return;
    }

    const playerContainer = document.getElementById('bitmovin-player');

    let stream = this.props.source;

    console.log(stream);

    const client = this.props.client;

    const { objectId } = client.utils.DecodeVersionHash(this.props.versionHash);
    const authToken = client.authClient.channelContentTokens[objectId];

    console.log(authToken);

      config.network = {
            preprocessHttpRequest(type, request) {

              request.headers.Authorization = `Bearer ${authToken}`;

              return Promise.resolve(request);
            }
          }

    this.player = new bitmovin.player.Player(playerContainer, config);

    setPlayerEvents(this.player);

    // If component has unmounted, don't initialize player
    if (this.destroyed) { return; }

    this.player.load(stream).then(
      player => {
      console.log('Successfully created Bitmovin Player instance');
    },
      reason => {
      console.log('Error while creating Bitmovin Player instance')
    }
    );

    this.setState({
      player: this.player
    });

  }

  async InitializePlayer(element){
    // if (!element || this.initialized || (this.props.bitmovinConfig)==="") {
    //
    //   console.log("unitialized");
    //   return;
    // }

      // this.initialized = true;

    try{

      const playerContainer = document.getElementById('player');

      // If component has unmounted, don't initialize player
      if (this.destroyed) { return; }

      this.player = new bitmovin.player.Player(element, config);

      this.setState({
        player: this.player
      });

    }catch(e){
      console.error(e);
    }

  }

  handleChange(event) {
    this.setState({value: event.target.value});
  }

  handleClick(event) {
    this.setState({value: event.target.value});
  }


  render(){

    let player = this.player;

    return(
      <div className = "row">
        <div className = "col-sm-10">

        <div className = "spacing"></div>

      <button className = "btn btn-outline-primary" onClick={this.LoadPlayer}>
        Play Stream
      </button>

      <div className = "spacing"></div>

      <h2> Stream </h2>
            <div id="bitmovin-player" ref={this.InitializePlayer}  >
        </div>

        <React.Fragment>

          <StreamStats player = {player} />

        </React.Fragment>

        </div>
      </div>

    );
  }

}

class StreamStats extends React.Component{

  constructor(props) {
    super(props);

    this.state = {
      value: '',
    };

    this.InitializeCharts = this.InitializeCharts.bind(this);

  }

  /* when new props are received, reload the charts */
  componentWillReceiveProps({player}) {
    this.InitializeCharts();
  }

  InitializeCharts(){

    console.log("initializing charts");
    console.log(this.props.player);

    let initialTimestamp = Date.now();
    let bufferChart = Highcharts.chart(document.getElementById("buffer-chart"), {

      chart: {
        type: 'spline',
        zoomType: 'x'
      },
      credits: {
        enabled: false
      },
      title: {
        text: 'Buffer Levels'
      },
      xAxis: {
        title: {
          text: 'time',
          align: 'low'
        },
        min: 0
      },
      yAxis: {
        title: {
          text: 'sec',
          align: 'high'
        },
        min: 0
      },
      legend: {
        align: 'center',
        verticalAlign: 'bottom'
      },
      series: [{
        name: 'Video',
        data: [[0, 0]],
        marker: {
          enabled: true,
          fillColor: '#ffffff',
          lineWidth: 2,
          lineColor: null,
          symbol: 'circle'
        },
        color: '#1FAAE2'
      }, {
        name: 'Audio',
        data: [[0, 0]],
        marker: {
          enabled: true,
          fillColor: '#ffffff',
          lineWidth: 2,
          lineColor: null,
          symbol: 'circle'
        },
        color: '#F49D1D'
      }],

      responsive: {
        rules: [{
          condition: {
            maxWidth: 500
          },
          chartOptions: {
            legend: {
              layout: 'horizontal',
              align: 'center',
              verticalAlign: 'bottom'
            }
          }
        }]
      }
    });

    let bitrateChart = Highcharts.chart(document.getElementById("bitrate-chart"), {
      chart: {
        type: 'spline',
        zoomType: 'x'
      },
      credits: {
        enabled: false
      },
      title: {
        text: 'Bitrate'
      },
      xAxis: {
        title: {
          text: 'time',
          align: 'low'
        },
        min: 0
      },
      yAxis: {
        title: {
          text: 'Mbps',
          align: 'high'
        },
        min: 0
      },
      legend: {
        align: 'center',
        verticalAlign: 'bottom'
      },
      series: [{
        name: 'Video',
        data: [[0, 0]],
        marker: {
          enabled: true,
          fillColor: '#ffffff',
          lineWidth: 2,
          lineColor: null,
          symbol: 'circle'
        },
        color: '#1FAAE2'
      }],
      responsive: {
        rules: [{
          condition: {
            maxWidth: 500
          },
          chartOptions: {
            legend: {
              layout: 'horizontal',
              align: 'center',
              verticalAlign: 'bottom'
            }
          }
        }]
      }
    });

    //from utility functions
    setCharts(bufferChart, bitrateChart, initialTimestamp);

  }

  render(){
    return(

      <div className = "row">

      <hr className="mt-5"/>

        <div className = "col-md-6">

          <div id="buffer-chart">
          </div>

        </div>

        <div className = "col-md-6">

          <div id="bitrate-chart" >
          </div>

          </div>

      </div>

    )
  }

}

function renderMessage(messageString, client, success){

  let show = true;

  let message = "";

  const elvclient = client;

  if(success){
    message = (
            <div id = "Message">
            <Alert variant="success" onClose={() => document.getElementById("Message").classList.add('hidden') } dismissible>
                <Alert.Heading>Successfully Created Client</Alert.Heading>
                <p value = {elvclient}>
                  Client Configuration: {elvclient.contentSpaceLibraryId}
                </p>
                <hr />
                <p className="mb-0">
                  Other details to add
                </p>
          </Alert>
              </div>
    );
  }
  else if(!success){
    message = (
            <div id = "Message">
            <Alert variant="danger" onClose={() => document.getElementById("Message").classList.add('hidden')} dismissible>
                <Alert.Heading>Error Creating Client</Alert.Heading>
                <p>
                  Error: {messageString}
                </p>
          </Alert>
              </div>
    );

  }

  return message;

}
