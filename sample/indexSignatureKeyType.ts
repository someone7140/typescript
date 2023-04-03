const indexSignatureKeyType = () => {
  const key = { key1: "key1", key2: "key2", key3: "key3" };
  const sampleObj = {
    [key.key1]: 1,
    [key.key2]: 2,
    [key.key3]: 3,
  };
  // 1が取得できる
  const sample1 = sampleObj[key.key1];
  console.log(sample1);
};

indexSignatureKeyType();
