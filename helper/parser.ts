import fs from "fs";
import readline from "readline";
import { M, toArray } from "./Map";
import { top } from "./top";

export async function parseFile() {
  const readable = fs.createReadStream(
    `./data/programming-task-example-data.log`
  ); // incase we need to parse a huge file

  const rl = readline.createInterface({
    input: readable,
    crlfDelay: Infinity,
  });

  const IPs = new M();
  const addresses = new M();

  for await (const str of rl) {
    const content = removeExtraContent(str);
    if (content) {
      const IP = getIP(content);
      if (IP) {
        const count = IPs.get(IP);
        if (count) {
          IPs.set(IP, count + 1);
        } else {
          IPs.set(IP, 1);
        }
      }

      const address = getURL(content);
      if (address) {
        const count = addresses.get(address);
        if (count) {
          addresses.set(address, count + 1);
        } else {
          addresses.set(address, 1);
        }
      }
    }
  }

  const uniqueIP = IPs.size;

  // Use a proper sort algorithm if trying to solve a very
  // big number n in "top n" problem.
  // Since we only care about top 3 here, the built-in sort is good enough
  const top3URLs = top(
    toArray(addresses),
    3
  ).sort((a: [string, number], b: [string, number]) =>
    a[1] < b[1] ? 1 : a[1] > b[1] ? -1 : 0
  );
  const top3IPs = top(
    toArray(IPs),
    3
  ).sort((a: [string, number], b: [string, number]) =>
    a[1] < b[1] ? 1 : a[1] > b[1] ? -1 : 0
  );

  return {
    uniqueIP,
    top3URLs,
    top3IPs,
  };
}

export function removeExtraContent(str: string): string | void {
  return str.split(" HTTP/")[0]; // we don't care about status, content-length, user-agent etc.
}

export function getIP(str: string): string | void {
  return str.split(" - ")[0]; // log format is /^(\d{1,3}\.){3}\d{1,3} - (-|admin) .*/
}

export function getURL(str: string): string | void {
  const tmp = str.split(`"`)[1]; // should be /^(METHOD) ADDRESSES$/ or undefined
  if (tmp) {
    return tmp.split(` `)[1]; // addresses should be encoded right?
  }
}
