import { assertEquals } from "std/testing/asserts.ts";
import * as Comlink from "../src/comlink.ts";
import { TestWorker } from "./fixtures/worker.deno.ts";

Deno.test("should not leak async ops after test.", async () => {
  const worker = new Worker(
    new URL("./fixtures/worker.deno.ts", import.meta.url),
    { type: "module" }
  );

  // MessageChannel via proxyTransferHandler: auto-closed
  let value = 0;
  const proxy = Comlink.wrap<TestWorker>(worker);
  await proxy.add(
    1,
    2,
    Comlink.proxy((result) => (value = result))
  );
  assertEquals(value, 3);

  // MessageChannel via createEndpoint: close manually
  const port = await proxy[Comlink.createEndpoint]();
  port.close();

  // op_host_recv_ctrl and op_host_recv_message: terminate the worker
  worker.terminate();
});
