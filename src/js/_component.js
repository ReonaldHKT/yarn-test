import React from 'react';
import ReactDOM from 'react-dom';
import classNames from 'classnames';
import fetchWrapper from './_fetchWrapper.js';

import KurukuruStyles from '../css/kurukuru.css';
class Kurukuru extends React.Component {
  constructor(){
    super();
  }
  render(){
    return (
      <div className={classNames(KurukuruStyles.kurukuru, {
          [KurukuruStyles.enable]: this.props.enable,
          [KurukuruStyles.disable]: !this.props.enable
        })}>
        <div>{this.props.children}</div>
      </div>
    );
  }
}

import HashrFormStyles from '../css/hashrForm.css';
class HashrForm extends React.Component {
  constructor(){
    super();
    this.state = {
      rawText: 'RawText',
      hashText: '',
      waiting: false
    }
  }
  onRawTextChange(e){
    this.setState({rawText: e.target.value});
  }
  onHashTextChange(e){
    this.setState({hashText: e.target.value});
  }
  onHashButtonClick(){
    console.log('wow');
    if(!this.state.waiting){
      this.setState({waiting: true});
      fetchWrapper('/api/hash/calculate', {
        method: 'POST',
        body: JSON.stringify({
          rawText: this.state.rawText,
          stretch: 14
        }),
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        }
      }).then(res => {
        const resObj = JSON.parse(res);
        this.setState({hashText: resObj.hash});
        this.setState({waiting: false});
      });
    }
  }
  onVerifyButtonClick(){
    console.log('wow');
    if(!this.state.waiting){
      this.setState({waiting: true});
      fetchWrapper('/api/hash/compare', {
        method: 'POST',
        body: JSON.stringify({
          rawText: this.state.rawText,
          hashText: this.state.hashText
        }),
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        }
      }).then(res => {
        const resObj = JSON.parse(res);
        window.prompt(resObj.result);
        this.setState({waiting: false});
      });
    }
  }
  render(){
    return (
      <div className={classNames(HashrFormStyles.form, this.props.className)}>
        <div className={classNames(HashrFormStyles.title)}>Hashr</div>
        <textarea className={classNames(HashrFormStyles.textArea, HashrFormStyles.rawTextArea)}  column='80' rows='20' value={this.state.rawText}  onChange={(e) => this.onRawTextChange(e)} />
        <div className={classNames(HashrFormStyles.buttonArea)}>
          <div className={classNames(HashrFormStyles.button)} onClick={() => this.onHashButtonClick()}>Hash</div>
          <Kurukuru enable={this.state.waiting}>⚡️</Kurukuru>
          <div className={classNames(HashrFormStyles.button)} onClick={() => this.onVerifyButtonClick()}>Verify</div>
        </div>
        <textarea className={classNames(HashrFormStyles.textArea, HashrFormStyles.hashTextArea)} column='80' rows='20' value={this.state.hashText} onChange={(e) => this.onHashTextChange(e)} />
      </div>
    );
  }
}

export default HashrForm;
