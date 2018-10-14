'use strict';

import React from 'react';
import ReactDOM from 'react-dom';
// import colorJS from './_color.js';
// import tapJS from './_tap.js';
import fetchWrapper from './_fetchWrapper.js';
import HashrForm from './_component.js';
import styles from '../css/main.css';

//
// const getHash = (raw, stretch) => {
//   if(typeof stretch != "number") stretch = 10;
//   return fetchWrapper('/api/hash/get/', {
//     method: 'POST',
//     body: JSON.stringify({
//       text: raw,
//       stretch: stretch
//     }),
//     headers: {
//       'Accept': 'application/json',
//       'Content-Type': 'application/json'
//     }
//   }).then(res => {
//     const resObj = JSON.parse(res);
//     if(resObj.successful){
//       return resObj.hash;
//     }else{
//       throw new Error(resObj.text);
//     }
//   }).catch(err => {
//     console.log(err);
//   });
// }
//
// const verifyHash = (text, hash) => {
//   return fetchWrapper('/api/hash/verify/', {
//     method: 'POST',
//     body: JSON.stringify({
//       text: text,
//       hash: hash
//     }),
//     headers: {
//       'Accept': 'application/json',
//       'Content-Type': 'application/json'
//     }
//   }).then(res => {
//     const resObj = JSON.parse(res);
//     if(resObj.successful){
//       return resObj.matched;
//     }else{
//       throw new Error(resObj.text);
//     }
//   }).catch(err => {
//     console.log(err);
//   });
// }



class App extends React.Component {
  render(){
    return (
      <div className={styles.wrapper}>
        <HashrForm className={styles.form}/>
      </div>
    );
  }
}

ReactDOM.render(
  <App />,
  document.querySelector('.content')
);
