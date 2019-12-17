### css
body {
	font-family: 'Source Sans Pro', sans-serif;
	margin: 0;
}
###

var counter = 0

tag hello-world
	### css scoped
	.day {
		font-size: 2.0rem;
		display: grid;
		grid-template: 1fr /  1fr 1fr;
		border-bottom: 1px solid gray;
		grid-gap: 1rem;
	}
	ruby {
		border-right: 1px solid gray;
		text-align: center;
	}

	
	.hello-world {
		display: grid;
		justify-content: center;
		padding: 1rem;
	}

	h1, footer {
		text-align: center;
		padding-bottom: 1rem;
	}

	footer {
		padding-bottom: 1rem;
	}
	footer a {
		text-decoration: none;
		color: hotpink;
	}
	
	###
	def incr
		counter++

	def render
		<self.hello-world>
			<link href="https://fonts.googleapis.com/css?family=Sawarabi+Mincho|Source+Sans+Pro&display=swap" rel="stylesheet">

			<header>
				<h1> "Japanese Weekdays"
				<p>
					"This static site is for myself so I can practice remembering the weekdays in Japanese."
						<br>
					"The emojis are just mnemonics I am using 😉"
			<div.day>
				<ruby> "日曜日"
					<rp> "("
					<rt> "にちようび"
					<rp> ")"
				"🌞 Sunday"
			<div.day>
				<ruby> "月曜日"
					<rp> "("
					<rt> "げつようび"
					<rp> ")"
				"🌚 Monday"
			<div.day>
				<ruby> "火曜日"
					<rp> "("
					<rt> "かようび"
					<rp> ")"
				"🔥 Tuesday"
			<div.day>
				<ruby> "水曜日"
					<rp> "("
					<rt> "すいようび"
					<rp> ")"
				"💧 Wednesday"
			<div.day>
				<ruby> "木曜日"
					<rp> "("
					<rt> "もくようび"
					<rp> ")"
				"🌲 Thursday"
			<div.day>
				<ruby> "金曜日"
					<rp> "("
					<rt> "きにょうび"
					<rp> ")"
				"🥈 Friday"
			<div.day>
				<ruby> "土曜日"
					<rp> "("
					<rt> "どようび"
					<rp> ")"
				"🚜 Saturday"
			<footer>
				<span>
					"Built by "
					<a href="https://github.com/scanf"> "scanf"
					" with "
					<a href="https://github.com/imba/imba"> "Imba v2.0.0-alpha.9"


imba.mount <hello-world>
