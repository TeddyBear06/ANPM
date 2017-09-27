// https://davidwalsh.name/query-string-javascript
function getUrlParameter(name) {
	name = name.replace(/[\[]/, '\\[').replace(/[\]]/, '\\]');
	var regex = new RegExp('[\\?&]' + name + '=([^&#]*)');
	var results = regex.exec(location.search);
	return results === null ? '' : decodeURIComponent(results[1].replace(/\+/g, ' '));
};
// http://airbnb.io/polyglot.js/
var polyglot = new Polyglot();
var current_language;
var fr = {
	"translateToMyLanguage": "Speak to me in english, please!",
	"translateLang": "en",
	"platformLabel": "Saisir la plateforme",
	"platformHelp": "Écrivez le nom de la plateforme. Si vous avez plusieurs comptes sur une même plateforme, utilisez une convention comme 'gmailmonnomdutilisateur'. Ex: youtube OU youtube.com OU gmailbob",	
	"masterKeyLabel": "Saisir un mot de passe",
	"masterKeyHelp": "Saisir votre mot de passe principal. Vous utiliserez le même pour toutes les plateformes.",
	"pinLabel": "Saisir un code PIN",
	"pinHelp": "Saisir un code pin à 4 chiffres. Comme le mot de passe principal, vous utiliserez le même pour toutes les plateformes.",
	"pinError": "Le code PIN ne doit comporter que 4 chiffres.",
	"yourPasswordLabel": "Votre mot de passe",
	"passwordCopy": "Copier !",
	"withoutSpecialCharactersLabel": "Supprimer les caractères spéciaux",
	"showPasswordLabel": "Afficher le mot de passe",
	"lowerCasePasswordLabel": "Uniquement des lettres minuscules",
	"passwordSizeLabel": "Nombre de caractères maximum",
	"passwordSizeMobileLabel": "Nb. carac."
};
var en = {
	"translateToMyLanguage": "Parlez-moi français, s'il vous plait !",
	"translateLang": "fr",
	"platformLabel": "Type in platform name",
	"platformHelp": "Type here the platform name. If you've several accounts for one platform use a convention like 'gmailmyusername'. Ex: youtube or youtube.com",	
	"masterKeyLabel": "Type your master key",
	"masterKeyHelp": "Insert here your master key. You will use the same on every platform.",
	"pinLabel": "Insert a PIN code",
	"pinHelp": "Type a 4 digits PIN code. As master key, you'll use the same PIN for every platform.",
	"pinError": "PIN code must contain only 4 digits.",
	"yourPasswordLabel": "Your password",
	"passwordCopy": "Copy!",
	"withoutSpecialCharactersLabel": "Remove special characters",
	"showPasswordLabel": "Display password",
	"lowerCasePasswordLabel": "Only lower case caracters",
	"passwordSizeLabel": "Maximum password size",
	"passwordSizeMobileLabel": "Size"
};
// Determine current lang or set it one by default
if( getUrlParameter('lang') ){
	current_language = getUrlParameter('lang');
	switch(current_language){
		case 'fr':
			polyglot.extend(fr);
		break;
		case 'en':
			polyglot.extend(en);
		break;
		default:
			polyglot.extend(en);
	}
}else{
	polyglot.extend(en);
}
// Dump function that tell us if a string is a alphabet caracter
function isLetter(str) {
	return str.length === 1 && str.match(/[a-z]/i);
}
// Dumb function to replace a caracter at a given index
String.prototype.replaceAt=function(index, replacement) {
	return this.substr(0, index) + replacement+ this.substr(index + replacement.length);
}
// The main app
var app = new Vue({
	el: "#anpm",
	data: {
		translateToMyLanguage: polyglot.t("translateToMyLanguage"),
		translateLang: "?lang=" + polyglot.t("translateLang"),
		platform: '',
		platformLabel: polyglot.t("platformLabel"),
		platformHelp: polyglot.t("platformHelp"),
		masterKey: '',
		masterKeyLabel: polyglot.t("masterKeyLabel"),
		masterKeyHelp: polyglot.t("masterKeyHelp"),
		pin: '',
		pinLabel: polyglot.t("pinLabel"),
		pinHelp: polyglot.t("pinHelp"),
		password: '',
		withoutSpecialCharacters: false,
		showPassword: false,
		lowerCasePassword: false,
		bankFormat: false,
		yourPasswordLabel: polyglot.t("yourPasswordLabel"),		
		passwordCopy: polyglot.t("passwordCopy"),
		withoutSpecialCharactersLabel: polyglot.t("withoutSpecialCharactersLabel"),
		passwordSize: 32,	
		showPasswordLabel: polyglot.t("showPasswordLabel"),
		lowerCasePasswordLabel: polyglot.t("lowerCasePasswordLabel"),
		passwordSizeLabel: polyglot.t("passwordSizeLabel"),
		passwordSizeMobileLabel: polyglot.t("passwordSizeMobileLabel"),
	},
	watch: {
		pin: function () {
			var numbers = /^[0-9]+$/;  
			if ( this.pin.match(numbers) && this.pin.length == 4 ){  
				this.generatePassword();
				this.showPassword = false;
			}else{
				this.password = '';
				this.showPassword = false;
			}
		},
		showPassword: function () {
			if ( this.showPassword ){
				document.getElementById('password').type = 'text';
			}else{
				document.getElementById('password').type = 'password';
			}
		},
		withoutSpecialCharacters: function () {
			this.generatePassword();
		},		
		lowerCasePassword: function () {
			this.generatePassword();
		},
		passwordSize: function () {
			this.generatePassword();
		}
	},
	methods: {
		copyToClipBoard: function(){
			// https://stackoverflow.com/questions/31593297/using-execcommand-javascript-to-copy-hidden-text-to-clipboard#answer-42416105
			var tempInput = document.createElement("input");
			tempInput.style = "position: absolute; left: -1000px; top: -1000px";
			tempInput.value = this.password;
			document.body.appendChild(tempInput);
			tempInput.select();
			document.execCommand("copy");
			document.body.removeChild(tempInput);
		},
		generatePassword: function(){
			if( this.pin.length == 4 ){
				special_caracters = ['!', '@', '&', '#', '.', '(', ')', '~', '$'];
				position = Math.abs( ( parseInt( this.pin[0] ) + parseInt( this.pin[1] ) + parseInt( this.pin[2] ) + parseInt( this.pin[3] ) ) - 4 );
				password = CryptoJS.PBKDF2(this.platform, this.masterKey + this.pin, { keySize: 128/32 });
				password = password.toString();
				var current_pin_position = 0;
				var firstLetterPosition = null;
				var numberCapitalLetters = 0;
				var numberLetters = 0;
				for(var i=0;i<password.length;i++){
					if( isLetter( password[i] ) ){
						numberLetters++;
						if( firstLetterPosition == null ){
							console.log('firstLetterPosition call');
							firstLetterPosition = i;
							console.log(firstLetterPosition);
						}
						if( parseInt( this.pin[current_pin_position] ) % 2 === 0 ){
							password = password.replaceAt(i, password[i].toUpperCase());
							numberCapitalLetters++;
						}
						current_pin_position++;
						if( current_pin_position > 3){
							current_pin_position = 0;
						}
					}
				}
				if( numberLetters == numberCapitalLetters ){
					password = password.replaceAt(firstLetterPosition, password[firstLetterPosition].toLowerCase());
				}
				if( ! this.withoutSpecialCharacters ){
					password = password.replaceAt(position, special_caracters[ this.pin[0] ]);
				}
				if( this.passwordSize < 32 && this.passwordSize > 0 ){
					password = password.slice(0, this.passwordSize);
				}
				if( this.lowerCasePassword ){
					password = password.toLowerCase();
				}
				this.password = password;
			}else{
				var pinErrorMessage = (current_language == 'fr' ? fr['pinError'] : en['pinError']);
				alert(pinErrorMessage);
			}
		}
	}
});
