type SampleType = {
  [key: string]: number;
};

const objectKeyMain = () => {
  const sampleType: SampleType = {
    test1: 1,
    test2: 2,
    test3: 3,
  };
  // 1が取得できる
  const sample1 = sampleType["test1"];
  console.log(sample1);
  // undefinedになる
  const sample4 = sampleType["test4"];
  console.log(sample4);
};

objectKeyMain();
