const {
  getURL,
  getItemCount,
  findBigItems,
  processFile,
} = require("../helper/log_helper");

const url_a = `177.71.128.21 - - [10/Jul/2018:22:21:28 +0200] "GET /intranet-analytics/ HTTP/1.1" 200 3574 A log file with test data is included with this assignment.`;
const url_b = `168.41.191.40 - - [09/Jul/2018:10:11:30 +0200] "GET http://example.net/faq/ HTTP/1.1" 200 3574 "-" "Mozilla/5.0 (Linux; U; Android 2.3.5; en-us; HTC Vision Build/GRI40) AppleWebKit/533.1 (KHTML, like Gecko) Version/4.0 Mobile Safari/533.1"`;
const urls = ["a", "b", "a", "c", "a", "d"];
const arr = [
  { key: "a", value: 3 },
  { key: "b", value: 10 },
  { key: "c", value: 18 },
  { key: "d", value: 18 },
  { key: "e", value: 100 },
];

const logs = [
  '168.41.191.40 - - [09/Jul/2018:10:11:30 +0200] "GET http://example.net/faq/ HTTP/1.1" 200 3574 "-" "Mozilla/5.0 (Linux; U; Android 2.3.5; en-us; HTC Vision Build/GRI40) AppleWebKit/533.1 (KHTML, like Gecko) Version/4.0 Mobile Safari/533.1"',
  '177.71.128.21 - - [10/Jul/2018:22:21:28 +0200] "GET /intranet-analytics/ HTTP/1.1" 200 3574 "-" "Mozilla/5.0 (X11; U; Linux x86_64; fr-FR) AppleWebKit/534.7 (KHTML, like Gecko) Epiphany/2.30.6 Safari/534.7"',
];

test("get main url from one log without http", () => {
  expect(getURL(url_a)).toBe("/intranet-analytics");
});

test("get main url from one log with http", () => {
  expect(getURL(url_b)).toBe("/faq");
});

test("get item count as array from log data", () => {
  expect(getItemCount(urls, "value")).toEqual([
    { key: "a", value: 3 },
    { key: "b", value: 1 },
    { key: "c", value: 1 },
    { key: "d", value: 1 },
  ]);
});

test("get the top 3 largest items from one array", () => {
  expect(findBigItems(arr, 3)).toEqual([
    { key: "e", value: 100 },
    { key: "c", value: 18 },
    { key: "d", value: 18 },
  ]);
});

test("get the top 1 largest items from one array", () => {
  expect(findBigItems(arr, 1)).toEqual([{ key: "e", value: 100 }]);
});

test("get final result from one array logs", () => {
  expect(processFile(logs)).toEqual({
    IPsCount: [
      { active: 1, key: "168.41.191.40" },
      { active: 1, key: "177.71.128.21" },
    ],
    UrlsCount: [
      { key: "/faq", visited: 1 },
      { key: "/intranet-analytics", visited: 1 },
    ],
    topThreeIPs: [
      { active: 1, key: "168.41.191.40" },
      { active: 1, key: "177.71.128.21" },
    ],
    topThreeURLs: [
      { key: "/faq", visited: 1 },
      { key: "/intranet-analytics", visited: 1 },
    ],
    uniqueIPs: ["168.41.191.40", "177.71.128.21"],
    uniqueIPsCount: 2,
  });
});
