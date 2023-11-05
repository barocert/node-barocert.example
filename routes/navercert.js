var express = require('express');
var router = express.Router();
var navercert = require('barocert');

navercert.config({
  // 링크아이디
  LinkID: 'TESTER',

  // 비밀키
  SecretKey: 'SwWxqU+0TErBXy/9TVjIPEnI0VTUMMSQZtJf3Ed8q3I=',

  // 인증토큰 IP제한기능 사용여부, true-사용, false-미사용, 기본값(true)
  IPRestrictOnOff: true,

  // 네이버써트 API 서비스 고정 IP 사용여부, true-사용, false-미사용, 기본값(false)
  UseStaticIP: false,

  defaultErrorHandler: function (Error) {
    console.log('Error Occur : [' + Error.code + '] ' + Error.message);
  }
});

/*
 * Navercert API 서비스 클래스 생성
 */
var navercertService = navercert.NavercertService();

/*
 * 네이버 이용자에게 본인인증을 요청합니다.
 * https://developers.barocert.com/reference/naver/node/identity/api#RequestIdentity
 */
router.get('/RequestIdentity', function (req, res, next) {

  // 이용기관코드, 파트너 사이트에서 확인
  var clientCode = '023060000088';

  // 본인인증 요청정보 객체
  var identity = {

    // 수신자 휴대폰번호 - 11자 (하이픈 제외)
    receiverHP: navercertService._encrypt('01012341234'),
    // 수신자 성명 - 80자
    receiverName: navercertService._encrypt('홍길동'),
    // 수신자 생년월일 - 8자 (yyyyMMdd)
    receiverBirthday: navercertService._encrypt('19700101'),

    // 고객센터 연락처 - 최대 12자
    callCenterNum: '1600-9854',

    // 인증요청 만료시간 - 최대 1,000(초)까지 입력 가능
    expireIn: 1000,

    // AppToApp 인증요청 여부
    // true - AppToApp 인증방식, false - Talk Message 인증방식
    appUseYN: false,

    // AppToApp 인증방식에서 사용
    // 모바일장비 유형('ANDROID', 'IOS'), 대문자 입력(대소문자 구분)
    // deviceOSType: 'ANDROID',

    // AppToApp 방식 이용시, 호출할 URL
    // returnURL: 'navercert://Identity'
  };

  navercertService.requestIdentity(clientCode, identity,
    function (result) {
      res.render('navercert/requestIdentity', { path: req.path, result: result });
    }, function (error) {
      res.render('response', { path: req.path, code: error.code, message: error.message });
    });
});

/*
 * 본인인증 요청 후 반환받은 접수아이디로 본인인증 진행 상태를 확인합니다.
 * https://developers.barocert.com/reference/naver/node/identity/api#GetIdentityStatus
 */
router.get('/GetIdentityStatus', function (req, res, next) {

  // 이용기관코드, 파트너 사이트에서 확인
  var clientCode = '023060000088';

  // 본인인증 요청시 반환받은 접수아이디
  var receiptId = '02309070230600000880000000000010';

  navercertService.getIdentityStatus(clientCode, receiptId,
    function (result) {
      res.render('navercert/getIdentityStatus', { path: req.path, result: result });
    }, function (error) {
      res.render('response', { path: req.path, code: error.code, message: error.message });
    });

});

/*
 * 완료된 전자서명을 검증하고 전자서명값(signedData)을 반환 받습니다.
 * 반환받은 전자서명값(signedData)과 [1. RequestIdentity] 함수 호출에 입력한 Token의 동일 여부를 확인하여 이용자의 본인인증 검증을 완료합니다.
 * 네이버 보안정책에 따라 검증 API는 1회만 호출할 수 있습니다. 재시도시 오류가 반환됩니다.
 * https://developers.barocert.com/reference/naver/node/identity/api#VerifyIdentity
 */
router.get('/VerifyIdentity', function (req, res, next) {

  // 이용기관코드, 파트너 사이트에서 확인
  var clientCode = '023060000088';

  // 본인인증 요청시 반환받은 접수아이디
  var receiptId = '02309070230600000880000000000010';

  navercertService.verifyIdentity(clientCode, receiptId,
    function (result) {
      res.render('navercert/verifyIdentity', { path: req.path, result: result });
    }, function (error) {
      res.render('response', { path: req.path, code: error.code, message: error.message });
    });

});

/*
 * 네이버 이용자에게 단건(1건) 문서의 전자서명을 요청합니다.
 * https://developers.barocert.com/reference/naver/node/sign/api-single#RequestSign
 */
router.get('/RequestSign', function (req, res, next) {

  // 이용기관코드, 파트너 사이트에서 확인
  var clientCode = '023060000088';

  // 전자서명 요청정보 객체
  var sign = {

    // 수신자 휴대폰번호 - 11자 (하이픈 제외)
    receiverHP: navercertService._encrypt('01012341234'),
    // 수신자 성명 - 80자
    receiverName: navercertService._encrypt('홍길동'),
    // 수신자 생년월일 - 8자 (yyyyMMdd)
    receiverBirthday: navercertService._encrypt('19700101'),

    // 인증요청 메시지 제목 - 최대 40자
    reqTitle: '전자서명(단건) 요청 메시지 제목',
    // 인증요청 메시지 - 최대 500자
    reqMessage: navercertService._encrypt('전자서명(단건) 요청 메시지'),
    // 고객센터 연락처 - 최대 12자
    callCenterNum: '1600-9854',
    // 인증요청 만료시간 - 최대 1,000(초)까지 입력 가능
    expireIn: 1000,
    // 서명 원문 - 원문 2,800자 까지 입력가능
    token: navercertService._encrypt('전자서명(단건) 요청 원문'),
    // 서명 원문 유형
    // TEXT - 일반 텍스트, HASH - HASH 데이터
    tokenType: 'TEXT',

    // AppToApp 인증요청 여부
    // true - AppToApp 인증방식, false - Talk Message 인증방식
    appUseYN: false,
    // AppToApp 인증방식에서 사용
    // 모바일장비 유형('ANDROID', 'IOS'), 대문자 입력(대소문자 구분)
    // deviceOSType: 'ANDROID',

    // AppToApp 방식 이용시, 호출할 URL
    // returnURL: 'navercert://Sign'
  };

  navercertService.requestSign(clientCode, sign,
    function (result) {
      res.render('navercert/requestSign', { path: req.path, result: result });
    }, function (error) {
      res.render('response', { path: req.path, code: error.code, message: error.message });
    });

});

/*
 * 전자서명(단건) 요청 후 반환받은 접수아이디로 인증 진행 상태를 확인합니다.
 * https://developers.barocert.com/reference/naver/node/sign/api-single#GetSignStatus
 */
router.get('/GetSignStatus', function (req, res, next) {

  // 이용기관코드, 파트너 사이트에서 확인
  var clientCode = '023060000088';

  // 전자서명 요청시 반환받은 접수아이디
  var receiptId = '02309070230600000880000000000012';

  navercertService.getSignStatus(clientCode, receiptId,
    function (result) {
      res.render('navercert/getSignStatus', { path: req.path, result: result });
    }, function (error) {
      res.render('response', { path: req.path, code: error.code, message: error.message });
    });

});

/*
 * 완료된 전자서명을 검증하고 전자서명값(signedData)을 반환 받습니다.
 * 네이버 보안정책에 따라 검증 API는 1회만 호출할 수 있습니다. 재시도시 오류가 반환됩니다.
 * https://developers.barocert.com/reference/naver/node/sign/api-single#VerifySign
 */
router.get('/VerifySign', function (req, res, next) {

  // 이용기관코드, 파트너 사이트에서 확인
  var clientCode = '023060000088';

  // 전자서명 요청시 반환받은 접수아이디
  var receiptId = '02309070230600000880000000000012';

  navercertService.verifySign(clientCode, receiptId,
    function (result) {
      res.render('navercert/verifySign', { path: req.path, result: result });
    }, function (error) {
      res.render('response', { path: req.path, code: error.code, message: error.message });
    });

});

/*
 * 네이버 이용자에게 복수(최대 50건) 문서의 전자서명을 요청합니다.
 * https://developers.barocert.com/reference/naver/node/sign/api-multi#RequestMultiSign
 */
router.get('/RequestMultiSign', function (req, res, next) {

  // 이용기관코드, 파트너 사이트에서 확인
  var clientCode = '023060000088';

  // 전자서명 요청정보 객체
  var multiSign = {

    // 수신자 휴대폰번호 - 11자 (하이픈 제외)
    receiverHP: navercertService._encrypt('01012341234'),
    // 수신자 성명 - 80자
    receiverName: navercertService._encrypt('홍길동'),
    // 수신자 생년월일 - 8자 (yyyyMMdd)
    receiverBirthday: navercertService._encrypt('19700101'),
    
    // 인증요청 메시지 제목 - 최대 40자
    reqTitle: '전자서명(복수) 요청 메시지 제목',
    // 인증요청 메시지 - 최대 500자
    reqMessage: navercertService._encrypt('전자서명(복수) 요청 메시지'),
    // 고객센터 연락처 - 최대 12자
    callCenterNum: '1600-9854',
    // 인증요청 만료시간 - 최대 1,000(초)까지 입력 가능
    expireIn: 1000,

    // 개별문서 등록 - 최대 50 건
    // 개별 요청 정보 객체
    tokens: [{
      // 서명 원문 유형
      // 'TEXT' - 일반 텍스트, 'HASH' - HASH 데이터
      tokenType: 'TEXT',
      // 서명 원문 - 원문 2,800자 까지 입력가능
      token: navercertService._encrypt('전자서명(복수) 요청 원문 1')
    }, {
      // 서명 원문 유형
      // 'TEXT' - 일반 텍스트, 'HASH' - HASH 데이터
      tokenType: 'HASH',
      // 서명 원문 - 원문 2,800자 까지 입력가능
      token: navercertService._encrypt('n4bQgYhMfWWaL-qgxVrQFaO_TxsrC4Is0V1sFbDwCgg')
    }],

    // AppToApp 인증요청 여부
    // true - AppToApp 인증방식, false - Talk Message 인증방식
    appUseYN: false,

    // AppToApp 인증방식에서 사용
    // 모바일장비 유형('ANDROID', 'IOS'), 대문자 입력(대소문자 구분)
    // deviceOSType: 'ANDROID',

    // AppToApp 방식 이용시, 호출할 URL
    // returnURL: 'navercert://Sign'
  };

  navercertService.requestMultiSign(clientCode, multiSign,
    function (result) {
      res.render('navercert/requestMultiSign', { path: req.path, result: result });
    }, function (error) {
      res.render('response', { path: req.path, code: error.code, message: error.message });
    });

});

/*
 * 전자서명(복수) 요청 후 반환받은 접수아이디로 인증 진행 상태를 확인합니다.
 * https://developers.barocert.com/reference/naver/node/sign/api-multi#GetMultiSignStatus
 */
router.get('/GetMultiSignStatus', function (req, res, next) {

  // 이용기관코드, 파트너 사이트에서 확인
  var clientCode = '023060000088';

  // 전자서명 요청시 반환받은 접수아이디
  var receiptId = '02309070230600000880000000000015';

  navercertService.getMultiSignStatus(clientCode, receiptId,
    function (result) {
      res.render('navercert/getMultiSignStatus', { path: req.path, result: result });
    }, function (error) {
      res.render('response', { path: req.path, code: error.code, message: error.message });
    });

});


/*
 * 완료된 전자서명을 검증하고 전자서명값(signedData)을 반환 받습니다.
 * 네이버 보안정책에 따라 검증 API는 1회만 호출할 수 있습니다. 재시도시 오류가 반환됩니다.
 * https://developers.barocert.com/reference/naver/node/sign/api-multi#VerifyMultiSign
 */
router.get('/VerifyMultiSign', function (req, res, next) {

  // 이용기관코드, 파트너 사이트에서 확인
  var clientCode = '023060000088';

  // 전자서명 요청시 반환받은 접수아이디
  var receiptId = '02309070230600000880000000000015';

  navercertService.verifyMultiSign(clientCode, receiptId,
    function (result) {
      res.render('navercert/verifyMultiSign', { path: req.path, result: result });
    }, function (error) {
      res.render('response', { path: req.path, code: error.code, message: error.message });
    });

});

module.exports = router;
