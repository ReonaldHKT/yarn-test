let fetchWrapper = function(urlString, options) {

  return fetch(urlString, options)
  .catch(err => {
    // corsエラー、networkエラー等、そもそもサーバへ本リクエストする以前のエラー
      console.log("CLIENT-ERR :", err)
    throw new Error("アクセスできません、時間を置いてお試しください")
  })
  .then(response => {
    // レスポンスのヘッダを処理したい場合はここで
    for (const pair of response.headers.entries()) {
      // console.log(" RES-HEADER: ", pair[0]+ ': '+ pair[1])
    }
    // 返り値はpromiseになってるので展開する
    const responseBodyPromise = response.text()
    return responseBodyPromise.then(body => ({ body: body, responseOk: response.ok }))
  })
  .then(({ body, responseOk }) => {
    // ここで正常なリクエスト完了だと判定
    if (responseOk) {
      return body
    }
    // サーバとのやりとりが出来ている40x系、50x系はここ
    console.log("SERVER-ERR :", body)
    throw new Error(body || "リクエストに失敗しました")
  })
}

export default fetchWrapper;
