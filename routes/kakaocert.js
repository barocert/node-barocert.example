var express = require('express');
var router = express.Router();
var kakaocert = require('barocert');

kakaocert.config({
  // 링크아이디
  LinkID: 'LINKHUB_BC',

  // 비밀키
  SecretKey: 'npCAl0sHPpJqlvMbrcBmNagrxkQ74w9Sl0A+M++kMCE=',

  // 인증토큰 IP제한기능 사용여부, 권장(true)
  IPRestrictOnOff: true,

  // 카카오써트 API 서비스 고정 IP 사용여부, true-사용, false-미사용, 기본값(false)
  UseStaticIP: false,

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
* 카카오톡 사용자에게 본인인증 전자서명을 요청합니다.
*/
router.get('/RequestIdentity', function (req, res, next) {

  // 이용기관코드, 파트너 사이트에서 확인
  var clientCode = '023030000004';

  // 본인인증 요청정보 객체
  var identity = {

    // 수신자 정보
    // 휴대폰번호,성명,생년월일 또는 Ci(연계정보)값 중 택 일
    receiverHP: kakaocertService._encrypt('01012341234'),
    receiverName: kakaocertService._encrypt('홍길동'),
    receiverBirthday: kakaocertService._encrypt('19700101'),
    // ci : kakaocertService._encrypt(''),

    // 인증요청 메시지 제목 - 최대 40자
    reqTitle: '인증요청 메시지 제목란',
    // 인증요청 만료시간 - 최대 1,000(초)까지 입력 가능
    expireIn: 1000,
    // 서명 원문 - 최대 2,800자 까지 입력가능
    token: kakaocertService._encrypt('본인인증요청토큰'),

    // AppToApp 인증요청 여부
    // true - AppToApp 인증방식, false - Talk Message 인증방식
    appUseYN: false,
    // App to App 방식 이용시, 호출할 URL
    returnURL: 'https://www.kakaocert.com'
  };

  kakaocertService.requestIdentity(clientCode, identity,
    function (result) {
      console.log(result)
      res.render('requestIdentity', { path: req.path, result: result });
    }, function (error) {
      res.render('response', { path: req.path, code: error.code, message: error.message });
    });
});

/*
* 본인인증 요청시 반환된 접수아이디를 통해 서명 상태를 확인합니다.
*/
router.get('/GetIdentityStatus', function (req, res, next) {

  // 이용기관코드, 파트너 사이트에서 확인
  var clientCode = '023030000004';

  // 본인인증 요청시 반환받은 접수아이디
  var receiptId = '02304190230300000040000000000016';

  kakaocertService.getIdentityStatus(clientCode, receiptId,
    function (result) {
      res.render('getIdentityStatus', { path: req.path, result: result });
    }, function (error) {
      res.render('response', { path: req.path, code: error.code, message: error.message });
    });

});

/*
* 본인인증 요청시 반환된 접수아이디를 통해 본인인증 서명을 검증합니다. 
* 검증하기 API는 완료된 전자서명 요청당 1회만 요청 가능하며, 사용자가 서명을 완료후 유효시간(10분)이내에만 요청가능 합니다.
*/
router.get('/VerifyIdentity', function (req, res, next) {

  // 이용기관코드, 파트너 사이트에서 확인
  var clientCode = '023030000004';

  // 본인인증 요청시 반환받은 접수아이디
  var receiptId = '02304190230300000040000000000016';

  kakaocertService.verifyIdentity(clientCode, receiptId,
    function (result) {
      res.render('verifyIdentity', { path: req.path, result: result });
    }, function (error) {
      res.render('response', { path: req.path, code: error.code, message: error.message });
    });

});

/*
* 카카오톡 사용자에게 전자서명을 요청합니다.(단건)
*/
router.get('/RequestSign', function (req, res, next) {

  // Kakaocert 이용기관코드, Kakaocert 파트너 사이트에서 확인
  var clientCode = '023030000004';

  // 전자서명 요청정보 객체
  var sign = {

    // 수신자 정보
    // 휴대폰번호,성명,생년월일 또는 Ci(연계정보)값 중 택 일
    receiverHP: kakaocertService._encrypt('01012341234'),
    receiverName: kakaocertService._encrypt('홍길동'),
    receiverBirthday: kakaocertService._encrypt('19700101'),
    // ci : kakaocertService._encrypt(''),

    // 인증요청 메시지 제목 - 최대 40자
    reqTitle: '전자서명단건테스트',
    // 인증요청 만료시간 - 최대 1,000(초)까지 입력 가능
    expireIn: 1000,
    // 서명 원문 - 원문 2,800자 까지 입력가능
    token: kakaocertService._encrypt('전자서명단건테스트데이터'),
    // 서명 원문 유형
    // TEXT - 일반 텍스트, HASH - HASH 데이터
    tokenType: 'TEXT',

    // AppToApp 인증요청 여부
    // true - AppToApp 인증방식, false - Talk Message 인증방식
    appUseYN: false,
    // App to App 방식 이용시, 호출할 URL
    returnURL: 'https://www.kakaocert.com',
  };

  kakaocertService.requestSign(clientCode, sign,
    function (result) {
      res.render('requestSign', { path: req.path, result: result });
    }, function (error) {
      res.render('response', { path: req.path, code: error.code, message: error.message });
    });

});

/*
* 전자서명 요청시 반환된 접수아이디를 통해 서명 상태를 확인합니다. (단건)
*/
router.get('/GetSignStatus', function (req, res, next) {

  // 이용기관코드, 파트너 사이트에서 확인
  var clientCode = '023030000004';

  // 전자서명 요청시 반환받은 접수아이디
  var receiptId = '02304190230300000040000000000021';

  kakaocertService.getSignStatus(clientCode, receiptId,
    function (result) {
      res.render('getSignStatus', { path: req.path, result: result });
    }, function (error) {
      res.render('response', { path: req.path, code: error.code, message: error.message });
    });

});

/*
* 전자서명 요청시 반환된 접수아이디를 통해 서명을 검증합니다. (단건)
* 검증하기 API는 완료된 전자서명 요청당 1회만 요청 가능하며, 사용자가 서명을 완료후 유효시간(10분)이내에만 요청가능 합니다.
*/
router.get('/VerifySign', function (req, res, next) {

  // 이용기관코드, 파트너 사이트에서 확인
  var clientCode = '023030000004';

  // 전자서명 요청시 반환받은 접수아이디
  var receiptId = '02304190230300000040000000000021';

  kakaocertService.verifySign(clientCode, receiptId,
    function (result) {
      res.render('verifySign', { path: req.path, result: result });
    }, function (error) {
      res.render('response', { path: req.path, code: error.code, message: error.message });
    });

});

/*
* 카카오톡 사용자에게 전자서명을 요청합니다.(복수)
*/
router.get('/RequestMultiSign', function (req, res, next) {

  // Kakaocert 이용기관코드, Kakaocert 파트너 사이트에서 확인
  var clientCode = '023030000004';

  // 전자서명 요청정보 객체
  var multiSign = {

    // 수신자 정보
    // 휴대폰번호,성명,생년월일 또는 Ci(연계정보)값 중 택 일
    receiverHP: kakaocertService._encrypt('01012341234'),
    receiverName: kakaocertService._encrypt('홍길동'),
    receiverBirthday: kakaocertService._encrypt('19700101'),
    // ci : kakaocertService._encrypt(''),

    // 인증요청 메시지 제목 - 최대 40자
    reqTitle: '전자서명복수테스트',
    // 인증요청 만료시간 - 최대 1,000(초)까지 입력 가능
    expireIn: 1000,

    // 개별문서 등록 - 최대 20 건
    // 개별 요청 정보 객체
    tokens: [{
      // 인증요청 메시지 제목 - 최대 40자
      reqTitle: '전자서명복수문서테스트1',
      // 서명 원문 - 원문 2,800자 까지 입력가능
      token: kakaocertService._encrypt('전자서명복수테스트데이터1')
    }, {
      // 인증요청 메시지 제목 - 최대 40자
      reqTitle: '전자서명복수문서테스트2',
      // 서명 원문 - 원문 2,800자 까지 입력가능
      token: kakaocertService._encrypt('전자서명복수테스트데이터2')
    }],

    // 서명 원문 유형
    // TEXT - 일반 텍스트, HASH - HASH 데이터
    tokenType: 'TEXT',

    // AppToApp 인증요청 여부
    // true - AppToApp 인증방식, false - Talk Message 인증방식
    appUseYN: false,

    // App to App 방식 이용시, 에러시 호출할 URL
    returnURL: 'https://www.kakaocert.com',
  };

  kakaocertService.requestMultiSign(clientCode, multiSign,
    function (result) {
      res.render('requestMultiSign', { path: req.path, result: result });
    }, function (error) {
      res.render('response', { path: req.path, code: error.code, message: error.message });
    });

});

/*
* 전자서명 요청시 반환된 접수아이디를 통해 서명 상태를 확인합니다. (복수)
*/
router.get('/GetMultiSignStatus', function (req, res, next) {

  // 이용기관코드, 파트너 사이트에서 확인
  var clientCode = '023030000004';

  // 전자서명 요청시 반환받은 접수아이디
  var receiptId = '02304190230300000040000000000026';

  kakaocertService.getMultiSignStatus(clientCode, receiptId,
    function (result) {
      res.render('getMultiSignStatus', { path: req.path, result: result });
    }, function (error) {
      res.render('response', { path: req.path, code: error.code, message: error.message });
    });

});


/*
* 전자서명 요청시 반환된 접수아이디를 통해 서명을 검증합니다. (복수)
* 검증하기 API는 완료된 전자서명 요청당 1회만 요청 가능하며, 사용자가 서명을 완료후 유효시간(10분)이내에만 요청가능 합니다.
*/
router.get('/VerifyMultiSign', function (req, res, next) {

  // 이용기관코드, 파트너 사이트에서 확인
  var clientCode = '023030000004';

  // 전자서명 요청시 반환받은 접수아이디
  var receiptId = '02304190230300000040000000000026';

  kakaocertService.verifyMultiSign(clientCode, receiptId,
    function (result) {
      res.render('verifyMultiSign', { path: req.path, result: result });
    }, function (error) {
      res.render('response', { path: req.path, code: error.code, message: error.message });
    });

});

/*
* 카카오톡 사용자에게 자동이체 출금동의 전자서명을 요청합니다.
 */
router.get('/RequestCMS', function (req, res, next) {

  // Kakaocert 이용기관코드, Kakaocert 파트너 사이트에서 확인
  var clientCode = '023030000004';

  // AppToApp 인증 여부
  // true-App To App 방식, false-Talk Message 방식
  var appUseYN = false;

  // 자동이체 출금동의 요청정보 객체
  var CMS = {
    // 수신자 정보
    // 휴대폰번호,성명,생년월일 또는 Ci(연계정보)값 중 택 일
    receiverHP: kakaocertService._encrypt('01012341234'),
    receiverName: kakaocertService._encrypt('홍길동'),
    receiverBirthday: kakaocertService._encrypt('19700101'),
    // ci : kakaocertService._encrypt(''),

    // 인증요청 메시지 제목 - 최대 40자
    reqTitle: '인증요청 메시지 제공란',
    // 인증요청 만료시간 - 최대 1,000(초)까지 입력 가능
    expireIn: 1000,
    // 청구기관명 - 최대 100자
    requestCorp: kakaocertService._encrypt('청구 기관명란'),
    // 출금은행명 - 최대 100자
    bankName: kakaocertService._encrypt('출금은행명란'),
    // 출금계좌번호 - 최대 32자
    bankAccountNum: kakaocertService._encrypt('9-4324-5117-58'),
    // 출금계좌 예금주명 - 최대 100자
    bankAccountName: kakaocertService._encrypt('예금주명 입력란'),
    // 출금게좌 예금주 생년월일 - 최대 8자
    bankAccountBirthday: kakaocertService._encrypt('19700101'),
    // 출금유형
    // CMS - 출금동의용, FIRM - 펌뱅킹, GIRO - 지로용
    bankServiceType: kakaocertService._encrypt('CMS'),

    // AppToApp 인증요청 여부
    // true - AppToApp 인증방식, false - Talk Message 인증방식
    appUseYN: false,

    // App to App 방식 이용시, 호출할 URL
    returnURL: 'https://www.kakaocert.com',
  };

  kakaocertService.requestCMS(clientCode, CMS,
    function (result) {
      res.render('requestCMS', { path: req.path, result: result });
    }, function (error) {
      res.render('response', { path: req.path, code: error.code, message: error.message });
    });
});

/*
 * 자동이체 출금동의 요청시 반환된 접수아이디를 통해 서명 상태를 확인합니다.
 */
router.get('/GetCMSStatus', function (req, res, next) {

  // 이용기관코드, 파트너 사이트에서 확인
  var clientCode = '023030000004';

  // 자동이체 출금동의 요청시 반환받은 접수아이디
  var receiptId = '02304190230300000040000000000029';

  kakaocertService.getCMSStatus(clientCode, receiptId,
    function (result) {
      res.render('getCMSStatus', { path: req.path, result: result });
    }, function (error) {
      res.render('response', { path: req.path, code: error.code, message: error.message });
    });
});

/*
 *  자동이체 출금동의 요청시 반환된 접수아이디를 통해 서명을 검증합니다.
 * 검증하기 API는 완료된 전자서명 요청당 1회만 요청 가능하며, 사용자가 서명을 완료후 유효시간(10분)이내에만 요청가능 합니다.
 */
router.get('/VerifyCMS', function (req, res, next) {

  // 이용기관코드, 파트너 사이트에서 확인
  var clientCode = '023030000004';

  // 자동이체 출금동의 요청시 반환받은 접수아이디
  var receiptId = '02304190230300000040000000000029';

  // AppToApp 인증 여부
  // true-App To App 방식, false-Talk Message 방식
  var appUseYN = false;

  kakaocertService.verifyCMS(clientCode, receiptId,
    function (response) {
      res.render('verifyCMS', { path: req.path, result: response });
    }, function (error) {
      res.render('response', { path: req.path, code: error.code, message: error.message });
    });
});

module.exports = router;
