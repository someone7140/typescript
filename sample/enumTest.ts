enum SampleEnum {
  ONE = 1,
  FIVE = 5,
  SEVEN = 7,
}

let sampleEnumValue: SampleEnum = SampleEnum.ONE;
// これはエラー
// sampleEnumValue = 2;

// number型の代入はOK
sampleEnumValue = parseInt("11");
// 11が代入されている
console.log(sampleEnumValue);
// 名称取得時は当然undefinedになる
console.log(SampleEnum[sampleEnumValue]);

// 値は7だけどnumber型なのでこれはエラー
// const sampleUnion: 1 | 5 | 7 = parseInt("7");
