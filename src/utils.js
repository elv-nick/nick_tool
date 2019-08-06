'use_strict';

import {ElvClient} from '@eluvio/elv-client-js'; //need to use ElvClient with curly braces because named export

export {MakeStateChannelToken, MakeTxToken, GenerateUrl,MakeClient,MakeCustomClient,MakeClientFromMnemonic, MakeCustomClientFromMnemonic, setPlayerEvents, setCharts}

const MakeClientFromMnemonic = async(configUrl) => {
  try{
    let client = await ElvClient.FromConfigurationUrl({configUrl});

    let wallet = client.GenerateWallet();

    const mnemonic = await wallet.GenerateMnemonic();
    const signer = wallet.AddAccountFromMnemonic({ mnemonic });

    client.SetSigner({ signer });

    return client;

  }catch(e){
    console.error(e);
    return e;
  }

}

const MakeCustomClientFromMnemonic = async() =>
{
  try{
    const fabricURIs = [furl];
    const ethereumURIs = [eurl];
    const spaceId = space + "";

    let client = new ElvClient({
      contentSpaceId: spaceId,
      fabricURIs: fabricURIs,
      ethereumURIs: ethereumURIs
    });

    let wallet = client.GenerateWallet();

    const mnemonic = await wallet.GenerateMnemonic();
    const signer = wallet.AddAccountFromMnemonic({ mnemonic });

    client.SetSigner({ signer });

    return client;

  }catch(e){
    console.error(e);
    return e;
  }

}
const MakeClient = async(configUrl, pk) => {

  try{
    let client = await ElvClient.FromConfigurationUrl({configUrl});

    let wallet = client.GenerateWallet();

    let signer = wallet.AddAccount({
      privateKey: pk
    });

    client.SetSigner({signer});

    return client;

  }catch(e){
    console.error(e);
    return e;
  }

}

const MakeCustomClient = async(furl, eurl, space, pk) => {

  try{

    /* @param {string} contentSpaceId - ID of the content space
    * @param {Array<string>} fabricURIs - A list of full URIs to content fabric nodes
    * @param {Array<string>} ethereumURIs
    */

    const fabricURIs = [furl];
    const ethereumURIs = [eurl];
    const spaceId = space + "";

    let client = new ElvClient({
      contentSpaceId: spaceId,
      fabricURIs: fabricURIs,
      ethereumURIs: ethereumURIs
    });

    let wallet = client.GenerateWallet();

    let signer = wallet.AddAccount({
      privateKey: pk
    });

    client.SetSigner({signer});

    return client;

  }catch(e){
    console.error(e);
  }

}

/* tool borrowed from Serban */
const MakeStateChannelToken = async(client, libraryId, objectId, versionHash) => {

  try{

    let tok = await client.authClient.AuthorizationToken({libraryId, objectId,
						    versionHash, channelAuth: true, noCache: true});

    return tok;

    }
    catch(e){
        console.error(e)
    }

}

const MakeTxToken = async(client, libraryId, objectId, versionHash) => {

  try{

    let tok = await client.authClient.AuthorizationToken({libraryId, objectId,
						    versionHash, channelAuth: false, noCache: true});

    return tok;

    }
    catch(e){
        console.error(e)
    }

}

const GenerateUrl = async(type, client, hash) => {

  const versionHash = hash;

  // Initialize preview image

  const availableDRMs = ['aes-128', 'widevine'];

  try
  {
      const poster = await client.Rep({versionHash, rep: 'player_background', channelAuth: true });

      try
      {
        const playoutOptions = await client.BitmovinPlayoutOptions({
          versionHash,
          protocols: ['dash', 'hls'],
          drms: availableDRMs
        });

        let source = {
          ...playoutOptions,
          poster
        };

        if(type === "hls"){
          source = {"hls":source[type]}
        }
        else if(type === "dash"){
          source = {"dash":source[type]}
        }
        else if(type === "drm"){
          source = {"drm":source[type]}
        }

        console.log(source);

        return source;

      }catch(e){
        console.error(e);
      }

  }catch(e){
    console.error(e);
  }

}

function updateCharts(player) {
    // console.log(player.getVideoBufferLength());
    // console.log(player.getAudioBufferLength());
    // console.log(player.getDownloadedVideoData().bitrate);
    addNewData(player.getVideoBufferLength(), player.getAudioBufferLength(), player.getDownloadedVideoData().bitrate);
  }

function addChartData(chart, seriesIndex, xAxis, yAxis) {
    chart.series[seriesIndex].addPoint([xAxis, yAxis], true, false);
  }

let bufferChart, bitrateChart, initialTimestamp;

function setCharts(chart1, chart2, timestamp){
  bufferChart = chart1;
  bitrateChart = chart2;
  initialTimestamp = timestamp;
}

function addNewData(videoBuffer, audioBuffer, bitrate) {
  var currentTimeDiff = (Date.now() - initialTimestamp) / 1000;

  addChartData(bufferChart, 0, currentTimeDiff, videoBuffer);
  addChartData(bufferChart, 1, currentTimeDiff, audioBuffer);
  addChartData(bitrateChart, 0, currentTimeDiff, bitrate / 1000000);
}

//from bitmovin github example
function setPlayerEvents(player) {
  let updateCount = 0;

  player.on(bitmovin.player.PlayerEvent.AudioPlaybackQualityChanged, function (data) {
    //log("On Audio Playback Quality Changed: " + JSON.stringify(data));
    updateCharts(player);
  });

  player.on(bitmovin.player.PlayerEvent.VideoPlaybackQualityChanged, function (data) {
    //log("On Video Playback Quality Changed: " + JSON.stringify(data));
    updateCharts(player);
  });

  player.on(bitmovin.player.PlayerEvent.StallStarted, function (data) {
    //log("On Buffering Started: " + JSON.stringify(data));
    updateCharts(player);
  });

  player.on(bitmovin.player.PlayerEvent.StallEnded, function (data) {
    //log("On Buffering Ended: " + JSON.stringify(data));
    updateCharts(player);
  });

  player.on(bitmovin.player.PlayerEvent.Playing, function (data) {
    //log("On Playing: " + JSON.stringify(data))
    updateCharts(player);
  });

  player.on(bitmovin.player.PlayerEvent.Paused, function (data) {
    //log("On Paused: " + JSON.stringify(data));
    updateCharts(player);
  });

  player.on(bitmovin.player.PlayerEvent.Play, function (data) {
    //log("On Play: " + JSON.stringify(data))
  });

  player.on(bitmovin.player.PlayerEvent.MetadataParsed, function (data) {
    //log("On Metadata Parsed: " + JSON.stringify(data))
  });

  player.on(bitmovin.player.PlayerEvent.Ready, function (data) {
    //log("On Ready: " + JSON.stringify(data));
    updateCharts(player);
  });

  player.on(bitmovin.player.PlayerEvent.SourceLoaded, function (data) {
    //log("On Loaded: " + JSON.stringify(data));
    updateCharts(player);
  });

  player.on(bitmovin.player.PlayerEvent.Error, function (data) {
    //log("On Error: " + JSON.stringify(data));
    updateCharts(player);
  });

  player.on(bitmovin.player.PlayerEvent.Seek, function (data) {
    //log("On Seek Started: " + JSON.stringify(data));
    updateCharts(player);
  });

  player.on(bitmovin.player.PlayerEvent.Seeked, function (data) {
    //log("On Seek Finished: " + JSON.stringify(data));
    updateCharts(player);
  });

  player.on(bitmovin.player.PlayerEvent.TimeChanged, function () {
    updateCount++;

  if (updateCount % 4 == 1) {
      updateCharts(player);
    }
  });
}
