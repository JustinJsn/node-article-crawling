import qiniu from "qiniu";

const CDN_HOST = "https://cdn.x-station.cn";
const mac = new qiniu.auth.digest.Mac(
  process.env.QINIU_AK,
  process.env.QINIU_SK
);
const options = {
  scope: process.env.QINIU_BUCKET,
  expires: 3600
};
const putPolicy = new qiniu.rs.PutPolicy(options);
const uploadToken = putPolicy.uploadToken(mac);
const config = new qiniu.conf.Config();
// 空间对应的机房
config.zone = qiniu.zone.Zone_z2;
// 是否使用https域名
config.useHttpsDomain = true;
// 上传是否使用cdn加速
config.useCdnDomain = true;

/**
 * 上传 cdn
 * @param {Object} params
 * @param {String} params.path 本地文件路径
 * @param {String} params.filename 保存的文件名称
 * @returns {Promise<{
 *  hash: String,
 *  key: String
 * }>}
 */
export default async function upload2Cdn({ path, filename }) {
  return new Promise((resolve, reject) => {
    const formUploader = new qiniu.form_up.FormUploader(config);
    const putExtra = new qiniu.form_up.PutExtra();
    const key = `dev/web/jinTestPost/${filename}`;

    formUploader.putFile(
      uploadToken,
      key,
      path,
      putExtra,
      (err, resBody, resInfo) => {
        if (err) {
          return reject(err);
        }

        if (resInfo.statusCode === 200) {
          const { key } = resBody;
          resolve(`${CDN_HOST}/${key}`);
          return;
        }

        reject("上传失败");
      }
    );
  });
}
