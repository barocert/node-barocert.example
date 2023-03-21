var express = require('express');
var router = express.Router();
var kakaocert = require('kakaocert');

kakaocert.config({
    // 링크아이디
    LinkID: 'BKAKAO',

    // 비밀키
    SecretKey: 'egkxYN99ZObjLa3c0nr9/riG+a0VDkZu87LSGR8c37U=',

    // 인증토큰 IP제한기능 사용여부, 권장(true)
    IPRestrictOnOff: true,

    // 카카오써트 API 서비스 고정 IP 사용여부, true-사용, false-미사용, 기본값(false)
    UseStaticIP : false,

    // 로컬시스템 시간 사용 여부 true - 사용, false-미사용, 기본값(false)
    UseLocalTimeYN: true,

    defaultErrorHandler: function (Error) {
        console.log('Error Occur : [' + Error.code + '] ' + Error.message);
    }
});

/*
 * Kakaocert API 서비스 클래스 생성
 */
var kakaocertService = kakaocert.KakaocertService();


 /*
  * 자동이체 출금동의 인증을 요청합니다.
  * - 
  */
router.get('/RequestCMS', function (req, res, next) {

  // Kakaocert 이용기관코드, Kakaocert 파트너 사이트에서 확인
  var clientCode = '020040000001';

  // AppToApp 인증 여부
  // true-App To App 방식, false-Talk Message 방식
  var appUseYN = false;

  // 자동이체 출금동의 요청정보 객체
  var requestCMS = {
      requestID : 'kakaocert_202303130000000000000000000001',
      receiverHP : '이승환',
      receiverName : '01087674117',
      receiverBirthday : '19930112',
      // ci : '',
      reqTitle : '인증요청 메시지 제공란',
      expireIn : 1000,
      returnURL : 'https://kakao.barocert.com',
      requestCorp : '청구 기관명란',
      bankName : '출금은행명란',
      bankAccountNum : '9-4324-5117-58',
      bankAccountName : '예금주명 입력란',
      bankAccountBirthday : '19930112',
      bankServiceType : 'CMS'
  };

  kakaocertService.requestCMS(clientCode, requestCMS, appUseYN,
    function(result){
      res.render('result', {path: req.path, result: result});
    }, function(error){
      res.render('response', {path: req.path, code: error.code, message: error.message});
  });
});

 /*
  * 자동이체 출금동의 인증을 요청합니다.
  * - 
  */
 router.get('/RequestCMS', function (req, res, next) {

  // Kakaocert 이용기관코드, Kakaocert 파트너 사이트에서 확인
  var clientCode = '020040000001';

  // AppToApp 인증 여부
  // true-App To App 방식, false-Talk Message 방식
  var appUseYN = false;

  // 자동이체 출금동의 요청정보 객체
  var requestCMS = {
      requestID : 'kakaocert_202303130000000000000000000001',
      receiverHP : '이승환',
      receiverName : '01087674117',
      receiverBirthday : '19930112',
      // ci : '',
      reqTitle : '인증요청 메시지 제공란',
      expireIn : 1000,
      returnURL : 'https://kakao.barocert.com',
      requestCorp : '청구 기관명란',
      bankName : '출금은행명란',
      bankAccountNum : '9-4324-5117-58',
      bankAccountName : '예금주명 입력란',
      bankAccountBirthday : '19930112',
      bankServiceType : 'CMS'
  };

  kakaocertService.requestCMS(clientCode, requestCMS, appUseYN,
    function(result){
      res.render('requestCMS', {path: req.path, result: result});
    }, function(error){
      res.render('response', {path: req.path, code: error.code, message: error.message});
  });
});

/*
 * 자동이체 출금동의 요청에 대한 서명 상태를 확인합니다.
 * - 
 */
router.get('/GetCMSState', function (req, res, next) {

  // 이용기관코드, 파트너 사이트에서 확인
  var clientCode = '023020000003';

  // 자동이체 출금동의 요청시 반환받은 접수아이디
  var receiptId = '0230309204458000000000000000000000000001';

  kakaocertService.getCMSState(clientCode, receiptId,
    function(result){
        res.render('getCMSState', {path: req.path, result: result});
    }, function(error){
        res.render('response', {path: req.path, code: error.code, message: error.message});
    });
});

/*
 * 자동이체 출금동의 요청에 대한 서명을 검증합니다.
 * - 
 */
router.get('/VerifyCMS', function (req, res, next) {

  // 이용기관코드, 파트너 사이트에서 확인
  var clientCode = '020040000001';

  // 자동이체 출금동의 요청시 반환받은 접수아이디
  var receiptId = '022050914013000001';

  // AppToApp 인증 여부
  // true-App To App 방식, false-Talk Message 방식
  var appUseYN = false;

  kakaocertService.verifyCMS(clientCode, receiptId, appUseYN,
    function(response){
        res.render('verifyCMS', {path: req.path, result: response});
    }, function(error){
        res.render('response', {path: req.path, code: error.code, message: error.message});
    });
});

/*
* 본인인증 전자서명을 요청합니다.
* - 
*/
router.get('/RequestVerifyAuth', function (req, res, next) {

  // 이용기관코드, 파트너 사이트에서 확인
  var clientCode = '020040000001';

  // AppToApp 인증 여부
  // true-App To App 방식, false-Talk Message 방식
  var appUseYN = false;

  // 본인인증 요청정보 객체
  var requestVerifyAuth = {
    // 수신자 정보(휴대폰번호, 성명, 생년월일)와 Ci 값 중 택일
    requestID : 'kakaocert_202303130000000000000000000001',
    receiverHP : '01087674117',
    receiverName : '이승환',
    receiverBirthday : '19930112',
    // ci : '',
    reqTitle : '인증요청 메시지 제목란',
    expireIn : 1000,
    token : '본인인증요청토큰',
    // App to App 방식 이용시, 에러시 호출할 URL
    returnURL : 'https://kakao.barocert.com'
  };

  kakaocertService.requestVerifyAuth(clientCode, requestVerifyAuth, appUseYN,
    function(result){
        res.render('requestVerifyAuth', {path: req.path, result: result});
    }, function(error){
        res.render('response', {path: req.path, code: error.code, message: error.message});
    });
});

/*
* 본인인증 요청시 반환된 접수아이디를 통해 서명 상태를 확인합니다.
* - 
*/
router.get('/GetVerifyAuthState', function (req, res, next) {

  // 이용기관코드, 파트너 사이트에서 확인
  var clientCode = '023020000003';

  // 본인인증 요청시 반환받은 접수아이디
  var receiptId = '0230309201738000000000000000000000000001';

  kakaocertService.getVerifyAuthState(clientCode, receiptId,
    function(result){
        res.render('getVerifyAuthState', {path: req.path, result: result});
    }, function(error){
        res.render('response', {path: req.path, code: error.code, message: error.message});
    });

});

/*
* 본인인증 요청시 반환된 접수아이디를 통해 본인인증 서명을 검증합니다.
* - 
*/
router.get('/VerifyAuth', function (req, res, next) {

  // 이용기관코드, 파트너 사이트에서 확인
  var clientCode = '020040000001';

  // 본인인증 요청시 반환받은 접수아이디
  var receiptId = '0230309195728000000000000000000000000001';

  kakaocertService.verifyAuth(clientCode, receiptId,
    function(result){
        res.render('verifyAuth', {path: req.path, result: result});
    }, function(error){
        res.render('response', {path: req.path, code: error.code, message: error.message});
    });

});

/*
* 전자서명 인증을 요청(다건)합니다.
* - 
*/
router.get('/RequestESign', function (req, res, next) {

  // Kakaocert 이용기관코드, Kakaocert 파트너 사이트에서 확인
  var clientCode = '020040000001';

  // AppToApp 인증 여부
  // true-App To App 방식, false-Talk Message 방식
  var appUseYN = false;

  // 전자서명 요청정보 객체
  var requestESign = {
    requestID : 'kakaocert_202303130000000000000000000001',
    receiverHP : '01087674117',
    receiverName : '이승환',
    receiverBirthday : '19930112',
    // ci : '',
    reqTitle : '전자서명다건테스트',
    expireIn : 1000,
    token : '전자서명단건테스트데이터',
    tokenType : 'TEXT',
    returnURL : 'https://kakao.barocert.com',
};

  kakaocertService.requestESign(clientCode, requestESign, appUseYN,
    function(result){
        res.render('requestESign', {path: req.path, result: result});
    }, function(error){
        res.render('response', {path: req.path, code: error.code, message: error.message});
    });

});

/*
* 전자서명 인증을 요청(다건)합니다.
* - 
*/
router.get('/BulkRequestESign', function (req, res, next) {

  // Kakaocert 이용기관코드, Kakaocert 파트너 사이트에서 확인
  var clientCode = '020040000001';

  // AppToApp 인증 여부
  // true-App To App 방식, false-Talk Message 방식
  var appUseYN = false;

  // 전자서명 요청정보 객체
  var requestESign = {
    requestID : 'kakaocert_202303130000000000000000000001',
    receiverHP : '01087674117',
    receiverName : '이승환',
    receiverBirthday : '19930112',
    // ci : '',
    reqTitle : '전자서명다건테스트',
    expireIn : 1000,
    token : '전자서명단건테스트데이터',
    tokenType : 'TEXT',
    returnURL : 'https://kakao.barocert.com',
};

  kakaocertService.requestESign(clientCode, requestESign, appUseYN,
    function(result){
        res.render('bulkRequestESign', {path: req.path, result: result});
    }, function(error){
        res.render('response', {path: req.path, code: error.code, message: error.message});
    });

});

/*
* 전자서명 요청시 반환된 접수아이디를 통해 서명 상태를 확인(단건)합니다.
* - 
*/
router.get('/GetESignState', function (req, res, next) {

  // 이용기관코드, 파트너 사이트에서 확인
  var clientCode = '023020000003';

  // 전자서명 요청시 반환받은 접수아이디
  var receiptId = '0230310143306000000000000000000000000001';

  kakaocertService.getESignState(clientCode, receiptId,
    function(result){
        res.render('getESignState', {path: req.path, result: result});
    }, function(error){
        res.render('response', {path: req.path, code: error.code, message: error.message});
    });

});

/*
* 전자서명 요청시 반환된 접수아이디를 통해 서명 상태를 확인(단건)합니다.
* - 
*/
router.get('/GetBulkESignState', function (req, res, next) {

  // 이용기관코드, 파트너 사이트에서 확인
  var clientCode = '023020000003';

  // 전자서명 요청시 반환받은 접수아이디
  var receiptId = '0230310143306000000000000000000000000001';

  kakaocertService.getBulkESignState(clientCode, receiptId,
    function(result){
        res.render('getBulkESignState', {path: req.path, result: result});
    }, function(error){
        res.render('response', {path: req.path, code: error.code, message: error.message});
    });

});

/*
* 전자서명 요청시 반환된 접수아이디를 통해 서명을 검증(다건)합니다.
* - 
*/
router.get('/VerifyESign', function (req, res, next) {

  // 이용기관코드, 파트너 사이트에서 확인
  var clientCode = '023020000003';

  // 전자서명 요청시 반환받은 접수아이디
  var receiptId = '0230310143306000000000000000000000000001';

  kakaocertService.verifyESign(clientCode, receiptId,
    function(result){
        res.render('verifyESign', {path: req.path, result: result});
    }, function(error){
        res.render('response', {path: req.path, code: error.code, message: error.message});
    });

});

/*
* 전자서명 요청시 반환된 접수아이디를 통해 서명을 검증(다건)합니다.
* - 
*/
router.get('/BulkVerifyESign', function (req, res, next) {

  // 이용기관코드, 파트너 사이트에서 확인
  var clientCode = '023020000003';

  // 전자서명 요청시 반환받은 접수아이디
  var receiptId = '0230310143306000000000000000000000000001';

  kakaocertService.bulkVerifyESign(clientCode, receiptId,
    function(result){
        res.render('bulkVerifyESign', {path: req.path, result: result});
    }, function(error){
        res.render('response', {path: req.path, code: error.code, message: error.message});
    });

});


module.exports = router;
