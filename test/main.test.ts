import { getIP, removeExtraContent, getURL, parseFile } from "../helper/parser";
import { select, top } from "../helper/top";

describe("parse string", () => {
  const arr = [
    `177.71.128.21 - - [10/Jul/2018:22:21:28 +0200] "GET /intranet-analytics/ HTTP/1.1" 200 3574 "-" "Mozilla/5.0 (X11; U; Linux x86_64; fr-FR) AppleWebKit/534.7 (KHTML, like Gecko) Epiphany/2.30.6 Safari/534.7"`,
    `168.41.191.40 - - [09/Jul/2018:10:11:30 +0200] "GET http://example.net/faq/ HTTP/1.1" 200 3574 "-" "Mozilla/5.0 (Linux; U; Android 2.3.5; en-us; HTC Vision Build/GRI40) AppleWebKit/533.1 (KHTML, like Gecko) Version/4.0 Mobile Safari/533.1"`,
    `168.41.191.43 - - [11/Jul/2018:17:43:40 +0200] "GET /moved-permanently HTTP/1.1" 301 3574 "-" "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_6_7) AppleWebKit/534.24 (KHTML, like Gecko) RockMelt/0.9.58.494 Chrome/11.0.696.71 Safari/534.24"`,
    `50.112.00.11 - admin [11/Jul/2018:17:31:05 +0200] "GET /hosting/ HTTP/1.1" 200 3574 "-" "Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/536.6 (KHTML, like Gecko) Chrome/20.0.1092.0 Safari/536.6"`,
  ];

  it("should remove unnecessary content", () => {
    for (let str of arr) {
      const content = removeExtraContent(str);
      expect(content).toBeTruthy();
      if (content) {
        expect(/Mozilla/.test(content)).toBeFalsy();
      }
    }
  });

  it("should get IP addresses", () => {
    expect(getIP(removeExtraContent(arr[0]) as string)).toBe(`177.71.128.21`);
    expect(getIP(removeExtraContent(arr[1]) as string)).toBe(`168.41.191.40`);
    expect(getIP(removeExtraContent(arr[2]) as string)).toBe(`168.41.191.43`);
    expect(getIP(removeExtraContent(arr[3]) as string)).toBe(`50.112.00.11`);
  });

  it("should get URL", () => {
    expect(getURL(removeExtraContent(arr[0]) as string)).toBe(
      `/intranet-analytics/`
    );
    expect(getURL(removeExtraContent(arr[1]) as string)).toBe(
      `http://example.net/faq/`
    );
    expect(getURL(removeExtraContent(arr[2]) as string)).toBe(
      `/moved-permanently`
    ); // do we want to exclude redirect from logs?
    expect(getURL(removeExtraContent(arr[3]) as string)).toBe(`/hosting/`);
  });
});

describe("top test", () => {
  it("should get mid number from array", () => {
    expect(
      select([
        ["15", 15],
        ["21", 21],
        ["13", 13],
        ["4", 4],
        ["5", 5],
        ["6", 6],
        ["7", 7],
        ["8", 8],
        ["11", 11],
        ["10", 10],
        ["9", 9],
      ])
    ).toEqual(["9", 9]);
  });

  it("should get top 5 number of an array", () => {
    // although top n problem doesn't care about order,
    // it would be easier to test the sorted array

    // if there are equivalent values in "top n", only parts of them will be selected
    expect(
      top(
        [
          ["1", 1],
          ["2", 1],
          ["3", 2],
          ["4", 1],
          ["5", 1],
          ["6", 1],
          ["7", 1],
          ["8", 1],
        ],
        3
      ).sort((a: [string, number], b: [string, number]) =>
        a[1] < b[1] ? -1 : a[1] > b[1] ? 1 : 0
      )
    ).toEqual([
      ["1", 1],
      ["2", 1],
      ["3", 2],
    ]);

    expect(
      top(
        [
          ["8", 8],
          ["11", 11],
          ["10", 10],
          ["9", 9],
        ],
        2
      ).sort((a: [string, number], b: [string, number]) =>
        a[1] < b[1] ? -1 : a[1] > b[1] ? 1 : 0
      )
    ).toEqual([
      ["10", 10],
      ["11", 11],
    ]);

    expect(
      top(
        [
          ["15", 15],
          ["21", 21],
          ["13", 13],
          ["4", 4],
          ["5", 5],
          ["6", 6],
          ["7", 7],
          ["8", 8],
          ["11", 11],
          ["10", 10],
          ["9", 9],
        ],
        5
      ).sort((a: [string, number], b: [string, number]) =>
        a[1] < b[1] ? -1 : a[1] > b[1] ? 1 : 0
      )
    ).toEqual([
      ["10", 10],
      ["11", 11],
      ["13", 13],
      ["15", 15],
      ["21", 21],
    ]);

    expect(
      top(
        [
          ["15", 15],
          ["21", 21],
          ["13", 13],
          ["4", 4],
          ["5", 5],
          ["6", 6],
          ["7", 7],
          ["8", 8],
          ["11", 11],
          ["10", 10],
          ["9", 9],
        ],
        9
      ).sort((a: [string, number], b: [string, number]) =>
        a[1] < b[1] ? -1 : a[1] > b[1] ? 1 : 0
      )
    ).toEqual([
      ["6", 6],
      ["7", 7],
      ["8", 8],
      ["9", 9],
      ["10", 10],
      ["11", 11],
      ["13", 13],
      ["15", 15],
      ["21", 21],
    ]);
  });
});

describe("parse file", () => {
  it("should get correct unique IP, top 3 visited URLs and top 3 active IP", async () => {
    const { top3IPs, top3URLs, uniqueIP } = await parseFile();
    expect(uniqueIP).toBe(11);

    expect(top3IPs).toEqual([
      ["168.41.191.40", 4],
      ["50.112.00.11", 3],
      ["72.44.32.10", 3],
    ]);

    // most urls are visited only once, just picked the first 2 record in demo file
    expect(top3URLs).toEqual([
      ["/docs/manage-websites/", 2],
      ["/intranet-analytics/", 1],
      ["http://example.net/faq/", 1],
    ]);
  });
});
