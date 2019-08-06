'use_strict';

import {ElvClient} from '@eluvio/elv-client-js';
import {MakeStateChannelToken, MakeTxToken, GenerateUrl, MakeClient,MakeCustomClient,MakeClientFromMnemonic,MakeCustomClientFromMnemonic} from './utils.js';
import {InputForm, VideoForm, Streaming, renderMessage} from './components.js'
import {config} from './bitmovin.js'
import React from 'react';
import ReactDOM from 'react-dom';
import 'bootstrap/dist/css/bootstrap.css';
import './styles.css';
import Alert from 'react-bootstrap/Alert'

let ClientConfiguration = require("../configuration.json");

//test net url
ClientConfiguration.configUrl = "https://main.net955304.contentfabric.io/config";
//"https://main.net955210.contentfabric.io/config";

/* for automatic module reloading on save */
if(module.hot){
  module.hot.accept('./index.js', function() {
    console.log('Accept updated module');
  })
}

/* entry point for program, and top react element  */
const LoadConfig = async () =>{

  try{

    class ConfigForm extends React.Component {
      constructor(props){
        super(props);
        this.state = {
          selectedOption: true,
          mnemonic: false,
          bootstrap: ClientConfiguration.configUrl,
          fabricUrl: "",
          ethereumUrl: "",
          space: "",
          privatekey: "",
          client: "",
          success: false,
          prevClient: undefined
        };

        this.handleChange = this.handleChange.bind(this);
        this.handleOptionChange = this.handleOptionChange.bind(this);
        this.handleLoad = this.handleLoad.bind(this);
        this.switchMnemonic = this.switchMnemonic.bind(this);
      }

      handleChange(event){
        const target = event.target;

        const value = target.value;
        const name = target.name;

        this.setState({
          [name]: value
        });

      }

      /* for logging client-side message on successful elvclient creation */
      componentDidUpdate(prevProps, prevState, snapshot){
        if(this.state.client != "" && this.state.client != prevState.client){

          console.log("inside state condition");
          //now set the state in a specific way
          this.setState({success: true});
          this.setState({prevClient: prevState.client})
        }
      }

      handleOptionChange(event) {
        const val = this.state.selectedOption;

        this.setState({
          selectedOption: !val
        });
      }

      switchMnemonic(event) {
        const val = this.state.mnemonic;

        this.setState({
          mnemonic: !val
        });
      }

      handleLoad(event){
        event.preventDefault();

        const target = event.target;

        if(pk===""){
          // log some clientside error
          // add state to change error message
        }

        const pk = this.state.privatekey;
        const configUrl = this.state.bootstrap;

        if(this.state.mnemonic === true ){
          /* if bootstrap selected */
          if(this.state.selectedOption===true){

            console.log("mnemonic with pk");

            MakeClientFromMnemonic(configUrl, pk).then(client => {this.setState({client: client});
            });

          }

          else {
            console.log("mnemonic with custom");
            MakeCustomClientFromMnemonic(furl, eurl, space, pk).then(client => {this.setState({client:client});

            });

          }

          console.log(this.state.client);
          return;

        }



        /* if bootstrap selected */
        if(this.state.selectedOption===true){
          console.log("bootstrap")

          MakeClient(configUrl, pk).then(client => {this.setState({client: client});
          });


          console.log(this.state.client);

        }
        /* if custom options are selected */
        else{
          console.log("custom config");

          const furl = this.state.fabricUrl;
          const eurl = this.state.ethereumUrl;
          const space = this.state.space;

          MakeCustomClient(furl, eurl, space, pk).then(client => {this.setState({client:client});
        });

        console.log(this.state.client);

        }

      }

      render() {

        let elvclient = this.state.client;

        let message = " ";

        /* if client has been successfully created, log client-side message */
        if((this.state.success) && this.state.prevClient != elvclient){
          console.log("should re-render");
          message = renderMessage("Success", elvclient, true);
        }

        return (
          <div>

          <div> {message} </div>

          <div className = "container">

            <h2> Configuration </h2>

            <div className = "row">

                <div className = "col-md-6">

                  <div>
                    <label>
                      Private Key:
                      <input className = "form-control" name = 'privatekey' type="text" value={this.state.privatekey} onChange={this.handleChange} />
                    </label>
                  </div>

                </div>

                <div className = "col-md-6">
                  <label>
                    Generate Mnemonic:
                  </label>
                  <input className = "form-control" name = 'mnemonic' type="checkbox" checked={this.state.mnemonic} onChange={this.switchMnemonic} />
                </div>

            </div>

            <hr className = "mt-5" />

            <div className = "row">
                <div className = "col-md-6">

                  <div className = "radio">
                  <input type="radio" value="option1" checked={this.state.selectedOption} onChange={this.handleOptionChange} />
                  </div>
                    <div className = "form-group">
                    <label>
                      Bootstrap URL:
                      <input className = "form-control" name = 'bootstrap' type="text" value={this.state.bootstrap} onChange={this.handleChange} />
                    </label>
                  </div>
              </div>


                <div className = "col-md-6">
                  <form className = "flex-column">

                  <div className = "radio">
                    <input type="radio" value="option2" checked={!this.state.selectedOption} onChange={this.handleOptionChange} />
                  </div>
                    <div className = "form-group">
                    <label>
                      Fabric URL:
                      <input className = "form-control" name = 'fabricUrl' type="text" value={this.state.fabricUrl} onChange={this.handleChange} />
                    </label>
                  </div>

                  <div className = "form-group">
                    <label>
                      Ethereum URL:
                      <input className = "form-control" name = 'ethereumUrl' type="text" value={this.state.ethereumUrl} onChange={this.handleChange} />
                    </label>
                  </div>

                  <div className = "form-group">
                    <label>
                      Space:
                      <input className = "form-control" name = 'space' type="text" value={this.state.space} onChange={this.handleChange} />
                    </label>
                  </div>

                    </form>
                </div>

              </div>

              <div className = "row">
                  <div className = "col-md-12">

                <button className = "btn btn-outline-primary" onClick={this.handleLoad}>
                  Load Settings
                </button>

              </div>
            </div>

                <div className = "spacing"></div>

                <React.Fragment>

                  <InputForm client = {elvclient} />

                </React.Fragment>

                </div>
              </div>

        );
    }

  }

    ReactDOM.render(
      <ConfigForm />,
      document.getElementById('config')
    );

  }
  catch(e){
    console.error(e);
  }

}

LoadConfig();
