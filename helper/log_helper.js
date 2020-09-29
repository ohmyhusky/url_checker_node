const getURL = (str) => {
  if (str !== "") {
    const res = str.match(/"(.*?)"/)[1].split(" ")[1];
    if (res.includes("http")) {
      const resWithDomain = new URL(res).pathname.split("/")[1];
      return `/${resWithDomain}`;
    } else {
      return `/${res.split("/")[1]}`;
    }
  }
  return null;
};

const getItemCount = (array, type) => {
  let result = [];

  for (let i = 0; i < array.length; i++) {
    const checkExisted =
      result.length === 0
        ? false
        : result.find((item) => item.key === array[i]);

    if (!checkExisted) {
      result.push({
        key: array[i],
        [type]: 1,
      });
    } else {
      result.find((item) => item.key === array[i])[type]++;
    }
  }

  return result.filter((x) => x.key !== null);
};

const findBigItems = (inp, count) => {
  let outp = [];
  for (let i = 0; i < inp.length; i++) {
    outp.push(inp[i]); // add item to output array
    if (outp.length > count) {
      outp.sort((a, b) => {
        return b.value - a.value;
      }); // descending sort the output array
      outp.pop(); // remove the last index (index of smallest element in output array)
    }
  }

  return outp;
};

const processFile = (content) => {
  // Get all ips from log
  const IPs = content
    .map((item) => item.split(" - ", 1)[0])
    .filter((item) => item !== "");
  // Get all urls from log
  const urls = content.map((item) => {
    return getURL(item);
  });

  // Get urls Count
  const UrlsCount = getItemCount(urls, "visited");
  // Get IPs Count
  const IPsCount = getItemCount(IPs, "active");
  // Get uniqueIPs
  let uniqueIPs = [];
  // Get topThreeURLs
  let topThreeURLs = findBigItems(UrlsCount, 3);
  // Get topThreeIPs
  let topThreeIPs = findBigItems(IPsCount, 3);

  IPsCount.map((ip) => {
    if (ip.active === 1) {
      uniqueIPs.push(ip.key);
    }
  });

  return {
    UrlsCount,
    IPsCount,
    topThreeURLs,
    topThreeIPs,
    uniqueIPs,
    uniqueIPsCount: uniqueIPs.length,
  };
};

module.exports = {
  getURL,
  getItemCount,
  findBigItems,
  processFile,
};
