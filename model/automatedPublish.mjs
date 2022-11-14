export default async function automatedPublish(page) {
	const submitButton = await page.$(
		'#app > div.layout-wrapper > div > div.post-publish > div.publish-post-content > div.footer > div.btn-group > button.btn.release-btn'
	);
	await submitButton.click();
}
