import { createServerFileRoute } from "@tanstack/react-start/server";
import { getSessionDataServerMw } from "@/utils/authentication";
import { getCloudflareBindings } from "@/utils/getCloudflareBindings";

export const ServerRoute = createServerFileRoute("/api/attachments/$key")
  .middleware([getSessionDataServerMw])
  .methods({
    GET: async ({ params }) => {
      const { ATTACHMENTS_BUCKET } = getCloudflareBindings();
      const key = decodeURIComponent(params.key);
      const object = await ATTACHMENTS_BUCKET.get(key);
      if (object === null)
        return new Response("Object Not Found", { status: 404 });
      const Headers_ = import.meta.env.DEV // https://github.com/cloudflare/workers-sdk/issues/6047
        ? (await import("miniflare")).Headers
        : Headers;
      // biome-ignore lint/suspicious/noExplicitAny: https://github.com/cloudflare/workers-sdk/issues/6047
      const responseHeaders = new Headers_() as any;
      object.writeHttpMetadata(responseHeaders);
      responseHeaders.set("etag", object.httpEtag);
      responseHeaders.set(
        "content-disposition",
        `attachment; filename="${key.split("/").pop() || "file"}"`,
      );
      return new Response(object.body, {
        status: 200,
        headers: responseHeaders,
      });

      // const range = request.headers.get("Range") ?? undefined;
      // const obj = await ATTACHMENTS_BUCKET.get(key, { range });

      // headers.set("accept-ranges", "bytes");
      // if (obj.size !== undefined) headers.set("content-length", String(obj.size));

      // // if (obj.range) {
      // //   const { offset, length } = obj.range;
      // //   const end = offset + length - 1;
      // //   headers.set("content-range", `bytes ${offset}-${end}/${obj.size}`);
      // //   return new Response(obj.body, { status: 206, headers: headers });
      // // }
      // return new Response(obj.body, { status: 200, headers: headers });
    },
  });
