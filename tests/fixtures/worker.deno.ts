import { expose } from "../../src/comlink.ts";

export class TestWorker {
  add(a: number, b: number, cb: (result: number) => void) {
    cb(a + b);
  }
}

expose(new TestWorker());
