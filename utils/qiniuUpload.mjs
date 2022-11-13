import qiniu from "qiniu";

const mac = new qiniu.auth.digest.Mac(
  process.env.QINIU_AK,
  process.env.QINIU_SK
);
const options = {
  scope: process.env.QINIU_BUCKET,
};
const putPolicy = new qiniu.rs.PutPolicy(options);
const uploadToken = putPolicy.uploadToken(mac);
const config = new qiniu.conf.Config();
// 空间对应的机房
config.zone = process.env.QINIU_ZONE;
// 是否使用https域名
config.useHttpsDomain = true;
// 上传是否使用cdn加速
config.useCdnDomain = true;

export default async function upload({ stream, fileName }) {
  return new Promise((resolve, reject) => {
    const formUploader = new qiniu.form_up.FormUploader(config);
    const putExtra = new qiniu.form_up.PutExtra();

    const key = `dev/web/jinTestPost/${fileName}`;

    formUploader.putStream(
      uploadToken,
      key,
      stream,
      putExtra,
      (err, res) => {
        if (err) {
          return reject(err);
        }

        resolve(res);
      }
    );
    console.log(uploadToken)
  });
}
