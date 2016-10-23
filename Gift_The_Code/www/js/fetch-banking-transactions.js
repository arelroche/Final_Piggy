function BankInfo () {
  var ref,
      accountPullIndex = 1;

  var fetchTransactions = function() {

    var promise = new Promise(function(resolve, reject) {
      ref = cordova.InAppBrowser.open('https://w.tdgroup.com/wireless/servlet/ca.tdbank.wireless3.servlet.AuthenticateServletR1?source=BBerry&LOGONTO=BANKE&&NATIVE_APP_VER=A6.0.0&IS_EMBEDDED_BROWSER=N&MARKUP=HTML&src=publicmobile', '_blank', 'location=yes');
      ref.addEventListener('loadstop', function(event) {
        // add event listener on login button to pull password
        if(event.url.indexOf("AuthenticateServletR1") == -1 && event.url.indexOf("ACCT") == -1){
          injectLoader();
          injectWill();
          setTimeout(function(){
            // change hard coded account pull index tho
            ref.executeScript({
              code: 'function pullAccountOverview(){var a,b,c;return $(".myAccValue").each(function(d){d%2===0?(console.log("Title: "+$(this).text()),a=$(this).text()):(console.log("Value: "+$(this).text()),b=$(this).text(),c=$(this).find("a").attr("href"),accountInfo.push([a,b,c]))}),JSON.stringify(accountInfo)}var accountInfo=[[0,0]];pullAccountOverview();'
            }, function(results) {
              localStorage.setItem("userAccountInfo", results[0]);
              //alert("Done Syncing User Info");
              ref.executeScript({
                code: 'window.location.href = accountInfo[' + accountPullIndex + '][2];'
              }, function(results) {
                //alert("Transaction view");
              });
              //ref.close();
              $("#insertedUserInfo").html(localStorage.getItem("userAccountInfo"));
            });
          }, 1000);
        } else if(event.url.indexOf("ACCT") > -1) {
          injectLoader();
          injectWill();
          setTimeout(function(){
            // itterate transaction info
            ref.executeScript({
              code: 'function pullAllTransactions(){var a,b,c;return $(".accountActivity").find("tr").each(function(d){$(this).hasClass("header")||(a=$(this).find("td:eq(0)").text(),b=$(this).find("td:eq(1)").text(),c=$(this).find("td:eq(2)").text()),transactionsAll.push([a,b,c])}),console.log(transactionsAll),JSON.stringify(transactionsAll)}var transactionsAll=[];pullAllTransactions();'
            }, function(results) {
              console.log(results[0]);
              localStorage.setItem("userAccountTransactions", results[0]);

              //alert("Pulled All Transactions");
              ref.close();
              alert("Thank you for syncing your account with TD! Please continue your account setup.");
              // run some demo functions
              //$("#header").css("height", "416px");

              if(localStorage.getItem("firstLogin") == null){
                // nothing
              } else {
                demoPopulateBars();
              }
              
              
              //alert(localStorage.getItem("userAccountTransactions"));
              //$("#insertedUserInfo").html(localStorage.getItem("userAccountInfo"));
              console.log("Syncing data done!");
              resolve();
            });
            //alert("Transaction info");
          }, 1000);
        }
      });
    });
    return promise
  }
    
  function injectWill() {
    ref.executeScript({
        code: "var jq = document.createElement('script');jq.src = 'https://ajax.googleapis.com/ajax/libs/jquery/2.1.4/jquery.min.js';document.getElementsByTagName('head')[0].appendChild(jq);"
    }, function() {
        console.log("jQuery Done");
    });
  }

  function injectLoader() {

    ref.executeScript({
        code: 'document.body.style.display = "none";'
    }, function() {
        console.log("loading inject done");
    });
  }

  return {
    fetchTransactions: fetchTransactions
  }
}
