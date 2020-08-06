const { MessageAttachment } = require('discord.js');
const { createCanvas, loadImage, registerFont } = require('canvas');

const applyText = (canvas, text) => {
	const ctx = canvas.getContext('2d');

	let fontSize = 70;

	do {
		ctx.font = `${(fontSize -= 10)}px Roboto-Light`;
	} while (ctx.measureText(text).width > canvas.width - 256);

	return ctx.font;
};

module.exports.welcomer = async (channel, member) => {
	const canvas = createCanvas(750, 256);
	const ctx = canvas.getContext('2d');

	registerFont('./utils/welcomer/fonts/Roboto-Medium.ttf', { family: 'Roboto-Medium' });
	registerFont('./utils/welcomer/fonts/Roboto-Light.ttf', { family: 'Roboto-Light' });

	const background = await loadImage('./utils/welcomer/background.png');
	ctx.drawImage(background, 0, 0, canvas.width, canvas.height);

	ctx.font = applyText(canvas, `Welcome in ${member.guild.name},`);
	ctx.fillStyle = '#ffffff';
	ctx.fillText(`Welcome in ${member.guild.name},`, canvas.width / 3, canvas.height / 2.45);

	ctx.font = applyText(canvas, `${member.user.tag}!`);
	ctx.fillStyle = '#ffffff';
	ctx.fillText(`${member.user.tag}!`, canvas.width / 3, canvas.height / 1.55);

	ctx.beginPath();
	ctx.arc(130, 130, 100, 0, Math.PI * 2, true);
	ctx.closePath();
	ctx.clip();

	const avatar = await loadImage(member.user.displayAvatarURL({ dynamic: true, size: 2048, format: 'png' }));
	ctx.drawImage(avatar, 30, 30, 200, 200);

	const attachment = new MessageAttachment(canvas.toBuffer(), 'welcome-image.png');

	channel.send(`Welcome in **${member.guild.name}**, ${member}!`, attachment);
};
