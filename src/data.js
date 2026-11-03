// Données de l'app : langues, phrases, plats et dialogues.
/* ---------- Données ---------- */
const LANGS={
  ru:{code:'RU',name:'russe',tts:'ru-RU',S:'Официант',C:'Клиент'},
  es:{code:'ES',name:'espagnol',tts:'es-ES',S:'Camarero',C:'Cliente'},
  it:{code:'IT',name:'italien',tts:'it-IT',S:'Cameriere',C:'Cliente'},
  en:{code:'EN',name:'anglais',tts:'en-GB',S:'Waiter',C:'Customer'},
  ro:{code:'RO',name:'roumain',tts:'ro-RO',S:'Ospătar',C:'Client'}
};
const ORDER=['ru','es','it','en','ro'];
const CATS={E:'Entrée',P:'Plat',G:'Garniture',C:'Fromage',D:'Dessert'};
const CAT_ORDER=['E','P','G','C','D'];
/* Emplacements des dialogues : H = deuxième garniture du menu */
const SLOT_LABEL={E:'entrée',P:'plat',G:'garniture',H:'deuxième garniture',C:'fromage',D:'dessert'};
const T=(fr,ru,es,it,en,ro,n)=>({fr,ru,es,it,en,ro,n});

const PHRASE_CATS=[
 {id:'pol',label:'Politesse',items:[
  T("Bonjour","Здравствуйте","Buenos días","Buongiorno","Hello","Bună ziua"),
  T("Bonsoir","Добрый вечер","Buenas noches","Buonasera","Good evening","Bună seara"),
  T("S'il vous plaît","Пожалуйста","Por favor","Per favore","Please","Vă rog"),
  T("Merci","Спасибо","Gracias","Grazie","Thank you","Mulțumesc"),
  T("Merci beaucoup","Большое спасибо","Muchas gracias","Grazie mille","Thank you very much","Mulțumesc mult"),
  T("De rien","Не за что","De nada","Prego","You're welcome","Cu plăcere"),
  T("Excusez-moi","Извините","Perdone","Mi scusi","Excuse me","Scuzați-mă"),
  T("Bon appétit !","Приятного аппетита!","¡Buen provecho!","Buon appetito!","Enjoy your meal!","Poftă bună!"),
  T("Au revoir","До свидания","Adiós","Arrivederci","Goodbye","La revedere"),
  T("Bonne soirée !","Хорошего вечера!","¡Que pase una buena noche!","Buona serata!","Have a nice evening!","O seară bună!")
 ]},
 {id:'cmd',label:'Prise de commande',items:[
  T("Vous avez choisi ?","Вы уже выбрали?","¿Ya ha elegido?","Ha già scelto?","Are you ready to order?","Ați ales?"),
  T("Je voudrais…","Я бы хотел…","Quisiera…","Vorrei…","I would like…","Aș dori…"),
  T("Je vais prendre…","Я возьму…","Voy a tomar…","Prendo…","I'll have…","Eu iau…"),
  T("En entrée","На закуску","De entrante","Come antipasto","For the starter","Ca antreu"),
  T("En plat principal","На горячее","De plato principal","Come secondo","For the main course","Ca fel principal"),
  T("En accompagnement","На гарнир","De guarnición","Come contorno","As a side","Ca garnitură"),
  T("En dessert","На десерт","De postre","Come dolce","For dessert","La desert"),
  T("Et comme boisson ?","Что будете пить?","¿Y para beber?","E da bere?","And to drink?","Ce doriți să beți?"),
  T("Qu'est-ce que vous me conseillez ?","Что вы посоветуете?","¿Qué me recomienda?","Cosa mi consiglia?","What would you recommend?","Ce îmi recomandați?"),
  T("Le menu du jour, s'il vous plaît","Меню дня, пожалуйста","El menú del día, por favor","Il menù del giorno, per favore","The set menu, please","Meniul zilei, vă rog"),
  T("Une table pour deux, s'il vous plaît","Столик на двоих, пожалуйста","Una mesa para dos, por favor","Un tavolo per due, per favore","A table for two, please","O masă pentru două persoane, vă rog"),
  T("Fromage ou dessert ?","Сыр или десерт?","¿Queso o postre?","Formaggio o dolce?","Cheese or dessert?","Brânză sau desert?"),
  T("Vous désirez autre chose ?","Что-нибудь ещё?","¿Desea algo más?","Desidera altro?","Anything else?","Mai doriți ceva?"),
  T("Je reviens tout de suite","Сейчас вернусь","Enseguida vuelvo","Torno subito","I'll be right back","Revin imediat")
 ]},
 {id:'use',label:'Phrases utiles',items:[
  T("L'addition, s'il vous plaît","Счёт, пожалуйста","La cuenta, por favor","Il conto, per favore","The bill, please","Nota, vă rog"),
  T("Je peux payer par carte ?","Можно оплатить картой?","¿Puedo pagar con tarjeta?","Posso pagare con la carta?","Can I pay by card?","Pot plăti cu cardul?"),
  T("Je suis allergique aux noix","У меня аллергия на орехи","Soy alérgico a los frutos secos","Sono allergico alla frutta secca","I'm allergic to nuts","Sunt alergic la nuci"),
  T("Sans oignons, s'il vous plaît","Без лука, пожалуйста","Sin cebolla, por favor","Senza cipolla, per favore","Without onions, please","Fără ceapă, vă rog"),
  T("C'est délicieux !","Очень вкусно!","¡Está delicioso!","È delizioso!","It's delicious!","Este delicios!"),
  T("Une carafe d'eau, s'il vous plaît","Графин воды, пожалуйста","Una jarra de agua, por favor","Una caraffa d'acqua, per favore","A jug of water, please","O carafă cu apă, vă rog"),
  T("Un verre de vin rouge","Бокал красного вина","Una copa de vino tinto","Un bicchiere di vino rosso","A glass of red wine","Un pahar de vin roșu"),
  T("Où sont les toilettes ?","Где туалет?","¿Dónde están los servicios?","Dov'è il bagno?","Where are the toilets?","Unde este toaleta?"),
  T("Je ne comprends pas","Я не понимаю","No entiendo","Non capisco","I don't understand","Nu înțeleg"),
  T("Pouvez-vous répéter ?","Повторите, пожалуйста","¿Puede repetir, por favor?","Può ripetere, per favore?","Could you repeat that, please?","Puteți repeta, vă rog?"),
  T("Très bien","Отлично","Muy bien","Benissimo","Very good","Foarte bine"),
  T("Bien sûr","Конечно","Por supuesto","Certo","Of course","Desigur")
 ]},
 {id:'num',label:'Nombres',items:[
  T("un","один","uno","uno","one","unu",1),
  T("deux","два","dos","due","two","doi",2),
  T("trois","три","tres","tre","three","trei",3),
  T("quatre","четыре","cuatro","quattro","four","patru",4),
  T("cinq","пять","cinco","cinque","five","cinci",5),
  T("six","шесть","seis","sei","six","șase",6),
  T("sept","семь","siete","sette","seven","șapte",7),
  T("huit","восемь","ocho","otto","eight","opt",8),
  T("neuf","девять","nueve","nove","nine","nouă",9),
  T("dix","десять","diez","dieci","ten","zece",10),
  T("douze","двенадцать","doce","dodici","twelve","doisprezece",12),
  T("quinze","пятнадцать","quince","quindici","fifteen","cincisprezece",15),
  T("vingt","двадцать","veinte","venti","twenty","douăzeci",20),
  T("vingt-cinq","двадцать пять","veinticinco","venticinque","twenty-five","douăzeci și cinci",25),
  T("trente","тридцать","treinta","trenta","thirty","treizeci",30),
  T("cinquante","пятьдесят","cincuenta","cinquanta","fifty","cincizeci",50),
  T("cent","сто","cien","cento","a hundred","o sută",100),
  T("euros","евро","euros","euro","euros","euro","€")
 ]},
 {id:'voc',label:'Vocabulaire de la carte',items:[
  T("l'entrée","закуска","el entrante","l'antipasto","the starter","antreul"),
  T("le plat principal","горячее блюдо","el plato principal","il secondo","the main course","felul principal"),
  T("l'accompagnement","гарнир","la guarnición","il contorno","the side dish","garnitura"),
  T("le dessert","десерт","el postre","il dolce","the dessert","desertul"),
  T("la boisson","напиток","la bebida","la bevanda","the drink","băutura"),
  T("la carte","меню","la carta","il menù","the menu","meniul"),
  T("le serveur","официант","el camarero","il cameriere","the waiter","ospătarul"),
  T("l'eau","вода","el agua","l'acqua","water","apa"),
  T("le vin","вино","el vino","il vino","wine","vinul"),
  T("le pain","хлеб","el pan","il pane","bread","pâinea"),
  T("le fromage","сыр","el queso","il formaggio","the cheese","brânza"),
  T("l'addition","счёт","la cuenta","il conto","the bill","nota")
 ]}
];

const D=(id,cat,fr,ru,es,it,en,ro)=>({id,cat,fr,ru,es,it,en,ro});
const DEFAULT_DISHES=[
 D('potage','E',"potage","суп-пюре","crema de verduras","passato di verdure","cream of vegetable soup","supă-cremă de legume"),
 D('betteraves-vinaigrette','E',"betteraves vinaigrette","свёкла с заправкой винегрет","remolacha con vinagreta","barbabietole in vinaigrette","beetroot vinaigrette","sfeclă cu vinegretă"),
 D('poireaux-vinaigrette','E',"poireaux vinaigrette","лук-порей с заправкой винегрет","puerros con vinagreta","porri in vinaigrette","leeks vinaigrette","praz cu vinegretă"),
 D('taboule','E',"taboulé","табуле","tabulé","tabbouleh","tabbouleh","tabbouleh"),
 D('thon-mayo','E',"thon mayonnaise","тунец с майонезом","atún con mayonesa","tonno con maionese","tuna mayonnaise","ton cu maioneză"),
 D('oeuf-mayo','E',"œuf mayonnaise","яйцо под майонезом","huevo con mayonesa","uovo con maionese","egg mayonnaise","ou cu maioneză"),
 D('bouillon-legumes','E',"bouillon de légumes","овощной бульон","caldo de verduras","brodo vegetale","vegetable broth","supă clară de legume"),
 D('bouillon-volaille','E',"bouillon de volaille","куриный бульон","caldo de ave","brodo di pollo","chicken broth","supă de pasăre"),
 D('quiche-lorraine','P',"quiche lorraine","киш лорен","quiche lorraine","quiche lorraine","quiche Lorraine","quiche lorraine"),
 D('chili-con-carne','P',"chili con carne","чили кон карне","chili con carne","chili con carne","chilli con carne","chili con carne"),
 D('tajine-poulet','P',"tajine de poulet aux olives","таджин из курицы с оливками","tajín de pollo con aceitunas","tajine di pollo con olive","chicken tagine with olives","tajine de pui cu măsline"),
 D('filet-merlu','P',"filet de merlu","филе хека","filete de merluza","filetto di nasello","hake fillet","file de merluciu"),
 D('jambon-beurre','P',"jambon beurre","багет с ветчиной и маслом","bocadillo de jamón y mantequilla","panino prosciutto e burro","ham and butter baguette","sandviș cu șuncă și unt"),
 D('tarte-fromage','P',"tarte au fromage","сырный пирог","tarta salada de queso","torta salata al formaggio","cheese tart","tartă cu brânză"),
 D('colin-pane','P',"colin pané","минтай в панировке","abadejo empanado","merluzzo impanato","breaded pollock","pește pané"),
 D('boulettes-boeuf','P',"boulettes de bœuf","говяжьи фрикадельки","albóndigas de ternera","polpette di manzo","beef meatballs","chiftele de vită"),
 D('galopin-veau','P',"galopin de veau","котлета из телятины","hamburguesa de ternera","hamburger di vitello","veal patty","chiftea de vițel"),
 D('tarte-poireaux','P',"tarte aux poireaux","пирог с луком-пореем","tarta de puerros","torta salata ai porri","leek tart","tartă cu praz"),
 D('tarte-mediterraneenne','P',"tarte méditerranéenne","средиземноморский пирог","tarta mediterránea","torta salata mediterranea","Mediterranean tart","tartă mediteraneană"),
 D('puree','G',"purée de pommes de terre","картофельное пюре","puré de patatas","purè di patate","mashed potatoes","piure de cartofi"),
 D('pommes-vapeur','G',"pommes vapeur","отварной картофель","patatas al vapor","patate al vapore","steamed potatoes","cartofi la abur"),
 D('pates','G',"pâtes","макароны","pasta","pasta","pasta","paste"),
 D('riz-nature','G',"riz nature","отварной рис","arroz blanco","riso in bianco","plain rice","orez simplu"),
 D('melange-ble','G',"mélange de blé","пшеничная смесь","mezcla de trigo","misto di grano","wheat blend","amestec de grâu"),
 D('semoule','G',"semoule","кускус","cuscús","cous cous","couscous","cuscus"),
 D('grenailles','G',"pommes de terre grenailles","молодой картофель","patatas baby","patate novelle","baby potatoes","cartofi noi"),
 D('puree-brocolis','G',"purée de brocolis","пюре из брокколи","puré de brócoli","purè di broccoli","broccoli purée","piure de broccoli"),
 D('ratatouille','G',"ratatouille","рататуй","ratatouille","ratatouille","ratatouille","ratatouille"),
 D('haricots-verts','G',"haricots verts","стручковая фасоль","judías verdes","fagiolini","green beans","fasole verde"),
 D('legumes-saison','G',"légumes de saison","сезонные овощи","verduras de temporada","verdure di stagione","seasonal vegetables","legume de sezon"),
 D('petits-pois','G',"petits pois carottes","горошек с морковью","guisantes con zanahoria","piselli e carote","peas and carrots","mazăre cu morcovi"),
 D('epinards','G',"épinards à la crème","шпинат со сливками","espinacas a la crema","spinaci alla panna","creamed spinach","spanac cu smântână"),
 D('edam','C',"edam","эдам","queso edam","edam","Edam","edam"),
 D('camembert','C',"camembert","камамбер","camembert","camembert","Camembert","camembert"),
 D('emmental','C',"emmental","эмменталь","emmental","emmental","Emmental","emmental"),
 D('brie','C',"brie","бри","brie","brie","Brie","brie"),
 D('fromage-blanc','C',"fromage blanc","мягкий творог","queso fresco batido","formaggio fresco","fromage frais","brânză proaspătă de vaci"),
 D('yaourt-nature','C',"yaourt nature","натуральный йогурт","yogur natural","yogurt bianco","plain yoghurt","iaurt natural"),
 D('puree-pommes','D',"purée de pommes","яблочное пюре","puré de manzana","purea di mele","apple purée","piure de mere"),
 D('cocktail-fruits','D',"cocktail de fruits","фруктовый коктейль","cóctel de frutas","cocktail di frutta","fruit cocktail","cocktail de fructe"),
 D('salade-fruits','D',"salade de fruits","фруктовый салат","macedonia de frutas","macedonia","fruit salad","salată de fructe"),
 D('fruit','D',"fruit","фрукт","fruta","frutta","a piece of fruit","fruct"),
 D('puree-pruneaux','D',"purée de pruneaux","пюре из чернослива","puré de ciruelas pasas","purea di prugne secche","prune purée","piure de prune uscate"),
 D('compote-pommes','D',"compote de pommes","тушёные яблоки","compota de manzana","composta di mele","stewed apples","compot de mere"),
 D('raisin','D',"raisin","виноград","uvas","uva","grapes","struguri"),
 D('banane','D',"banane","банан","plátano","banana","banana","banană"),
 D('pomme','D',"pomme","яблоко","manzana","mela","apple","măr"),
 D('ananas','D',"ananas","ананас","piña","ananas","pineapple","ananas"),
 D('flan','D',"flan","флан","flan","flan","flan","flan"),
 D('yaourt-caramel','D',"yaourt au caramel","йогурт с карамелью","yogur de caramelo","yogurt al caramello","caramel yoghurt","iaurt cu caramel"),
 D('mousse-chocolat','D',"mousse au chocolat","шоколадный мусс","mousse de chocolate","mousse al cioccolato","chocolate mousse","mousse de ciocolată"),
 D('gateau-riz','D',"gâteau de riz","рисовый пудинг","arroz con leche","budino di riso","rice pudding","budincă de orez")
];

const L=(r,fr,ru,es,it,en,ro)=>({r,fr,ru,es,it,en,ro});
const DIALOGUES=[
 {title:"La commande classique",desc:"Entrée, conseil du serveur, accompagnement, boisson et dessert.",lines:[
  L('S',"Bonsoir, bienvenue ! Vous avez choisi ?","Добрый вечер, добро пожаловать! Вы уже выбрали?","Buenas noches, ¡bienvenido! ¿Ya ha elegido?","Buonasera, benvenuto! Ha già scelto?","Good evening, welcome! Are you ready to order?","Bună seara, bine ați venit! Ați ales?"),
  L('C',"Oui. En entrée : {E}, s'il vous plaît.","Да. На закуску — {E}, пожалуйста.","Sí. De entrante, {E}, por favor.","Sì. Come antipasto, {E}, per favore.","Yes. For the starter, {E}, please.","Da. Ca antreu, {E}, vă rog."),
  L('S',"Très bien. Et en plat principal ?","Отлично. А на горячее?","Muy bien. ¿Y de plato principal?","Benissimo. E come secondo?","Very good. And for the main course?","Foarte bine. Și ca fel principal?"),
  L('C',"Qu'est-ce que vous me conseillez ?","Что вы посоветуете?","¿Qué me recomienda?","Cosa mi consiglia?","What would you recommend?","Ce îmi recomandați?"),
  L('S',"Je vous recommande notre spécialité : {P}.","Рекомендую наше фирменное блюдо — {P}.","Le recomiendo nuestra especialidad: {P}.","Le consiglio la nostra specialità: {P}.","I recommend our speciality: {P}.","Vă recomand specialitatea casei: {P}."),
  L('C',"Parfait, je prends ça. Avec quel accompagnement ?","Отлично, беру. А какой гарнир?","Perfecto, lo tomo. ¿Con qué guarnición?","Perfetto, lo prendo. Con quale contorno?","Perfect, I'll have that. What does it come with?","Perfect, îl iau. Cu ce garnitură?"),
  L('S',"Il est servi avec {G} et {H}.","Гарнир — {G} и {H}.","Se sirve con {G} y {H}.","Viene servito con {G} e {H}.","It comes with {G} and {H}.","Se servește cu {G} și {H}."),
  L('S',"Et comme boisson ?","Что будете пить?","¿Y para beber?","E da bere?","And to drink?","Ce doriți să beți?"),
  L('C',"Un verre de vin rouge et une carafe d'eau.","Бокал красного вина и графин воды.","Una copa de vino tinto y una jarra de agua.","Un bicchiere di vino rosso e una caraffa d'acqua.","A glass of red wine and a jug of water.","Un pahar de vin roșu și o carafă cu apă."),
  L('S',"Vous prendrez un fromage ? Aujourd'hui, c'est {C}.","Будете сыр? Сегодня у нас {C}.","¿Va a tomar queso? Hoy tenemos {C}.","Prende un formaggio? Oggi c'è {C}.","Would you like some cheese? Today we have {C}.","Doriți brânză? Astăzi avem {C}."),
  L('C',"Oui, volontiers.","Да, с удовольствием.","Sí, con mucho gusto.","Sì, volentieri.","Yes, please.","Da, cu plăcere."),
  L('S',"Vous prendrez un dessert ?","Десерт будете?","¿Va a tomar postre?","Prende un dolce?","Would you like a dessert?","Doriți un desert?"),
  L('C',"Oui : {D}, s'il vous plaît.","Да, {D}, пожалуйста.","Sí, {D}, por favor.","Sì, {D}, per favore.","Yes, {D}, please.","Da, {D}, vă rog."),
  L('S',"Très bien, je reviens tout de suite.","Хорошо, сейчас вернусь.","Muy bien, enseguida vuelvo.","Benissimo, torno subito.","Very good, I'll be right back.","Foarte bine, revin imediat.")
 ]},
 {title:"Le menu du jour",desc:"Le serveur présente le menu et son prix, le client choisit son accompagnement.",lines:[
  L('S',"Bonjour ! Voici le menu du jour à {PXE}.","Здравствуйте! Вот меню дня за {PXE}.","¡Buenos días! Aquí tiene el menú del día, a {PXE}.","Buongiorno! Ecco il menù del giorno a {PXE}.","Hello! Here is the set menu, at {PXE}.","Bună ziua! Poftiți meniul zilei, la {PXE}."),
  L('C',"Merci. Qu'est-ce qu'il y a dans le menu ?","Спасибо. Что входит в меню?","Gracias. ¿Qué incluye el menú?","Grazie. Cosa c'è nel menù?","Thank you. What's on the menu?","Mulțumesc. Ce include meniul?"),
  L('S',"En entrée, {E}. En plat, {P}.","На закуску — {E}. На горячее — {P}.","De entrante, {E}. De principal, {P}.","Come antipasto, {E}. Come secondo, {P}.","For the starter, {E}. For the main course, {P}.","Ca antreu, {E}. Ca fel principal, {P}."),
  L('S',"Puis, en fromage, {C}.","Потом сыр — {C}.","Luego, de queso, {C}.","Poi, come formaggio, {C}.","Then {C} for the cheese course.","Apoi, la brânzeturi, {C}."),
  L('S',"Et en dessert, {D}.","А на десерт — {D}.","Y de postre, {D}.","E come dolce, {D}.","And for dessert, {D}.","Iar la desert, {D}."),
  L('C',"Je peux choisir l'accompagnement ?","Можно выбрать гарнир?","¿Puedo elegir la guarnición?","Posso scegliere il contorno?","Can I choose the side?","Pot alege garnitura?"),
  L('S',"Bien sûr : {G} ou {H}.","Конечно: {G} или {H}.","Por supuesto: {G} o {H}.","Certo: {G} oppure {H}.","Of course: {G} or {H}.","Desigur: {G} sau {H}."),
  L('C',"Je préfère {H}, s'il vous plaît.","Лучше {H}, пожалуйста.","Prefiero {H}, por favor.","Preferisco {H}, per favore.","I'd rather have {H}, please.","Prefer {H}, vă rog."),
  L('S',"Pas de problème. Je vous apporte du pain ?","Хорошо. Принести хлеб?","Sin problema. ¿Le traigo pan?","Nessun problema. Le porto del pane?","No problem. Shall I bring you some bread?","Nicio problemă. Vă aduc pâine?"),
  L('C',"Oui, merci beaucoup.","Да, большое спасибо.","Sí, muchas gracias.","Sì, grazie mille.","Yes, thank you very much.","Da, mulțumesc mult.")
 ]},
 {title:"Une allergie",desc:"Le client signale une allergie, le serveur vérifie et la commande s'adapte.",lines:[
  L('C',"Excusez-moi, je suis allergique aux noix.","Извините, у меня аллергия на орехи.","Perdone, soy alérgico a los frutos secos.","Mi scusi, sono allergico alla frutta secca.","Excuse me, I'm allergic to nuts.","Scuzați-mă, sunt alergic la nuci."),
  L('C',"Il y a des noix dans le plat « {P} » ?","Есть ли орехи в блюде «{P}»?","¿El plato «{P}» lleva frutos secos?","C'è frutta secca nel piatto «{P}»?","Are there any nuts in the {P}?","Felul «{P}» conține nuci?"),
  L('S',"Non, pas de noix. Mais je vais vérifier avec le chef.","Нет, орехов нет. Но я уточню у шеф-повара.","No, no lleva. Pero voy a confirmarlo con el chef.","No, niente frutta secca. Ma chiedo conferma allo chef.","No, there are no nuts. But I'll check with the chef.","Nu, nu conține nuci. Dar voi verifica cu bucătarul-șef."),
  L('C',"Merci. Et le dessert, {D}, c'est possible ?","Спасибо. А десерт — {D} — можно?","Gracias. ¿Y el postre, {D}, puedo tomarlo?","Grazie. E il dolce, {D}, posso prenderlo?","Thank you. And the dessert, {D}, is that OK?","Mulțumesc. Și desertul, {D}, se poate?"),
  L('S',"Je vous le déconseille : il peut contenir des traces de noix.","Лучше не стоит: там могут быть следы орехов.","Mejor no: puede contener trazas de frutos secos.","Meglio di no: può contenere tracce di frutta secca.","I'd advise against it: it may contain traces of nuts.","Mai bine nu: poate conține urme de nuci."),
  L('C',"D'accord. Alors {E} et {P}, et un café à la place du dessert.","Хорошо. Тогда {E} и {P}, а вместо десерта — кофе.","De acuerdo. Entonces {E} y {P}, y un café en lugar del postre.","D'accordo. Allora {E} e {P}, e un caffè al posto del dolce.","All right. Then {E} and {P}, and a coffee instead of dessert.","Bine. Atunci {E} și {P}, iar în loc de desert, o cafea."),
  L('S',"C'est noté. Je préviens la cuisine.","Записал. Я предупрежу кухню.","Anotado. Aviso a la cocina.","Perfetto, avviso la cucina.","Noted. I'll let the kitchen know.","Am notat. Anunț bucătăria.")
 ]},
 {title:"À deux, jusqu'à l'addition",desc:"Une table pour deux, une commande groupée, puis le paiement.",lines:[
  L('C',"Bonsoir, une table pour deux, s'il vous plaît.","Добрый вечер, столик на двоих, пожалуйста.","Buenas noches, una mesa para dos, por favor.","Buonasera, un tavolo per due, per favore.","Good evening, a table for two, please.","Bună seara, o masă pentru două persoane, vă rog."),
  L('S',"Bien sûr, suivez-moi. Voici la carte.","Конечно, проходите. Вот меню.","Claro, síganme. Aquí tienen la carta.","Certo, seguitemi. Ecco il menù.","Of course, follow me. Here is the menu.","Desigur, urmați-mă. Poftiți meniul."),
  L('C',"Nous allons prendre deux menus du jour.","Нам два меню дня, пожалуйста.","Vamos a tomar dos menús del día.","Prendiamo due menù del giorno.","We'll have two set menus, please.","Luăm două meniuri ale zilei."),
  L('S',"Donc deux fois {E}, puis {P} avec {G} et {H}.","Итак: {E} — две порции, потом {P}, гарнир — {G} и {H}.","Entonces, dos de {E}, luego {P} con {G} y {H}.","Quindi due {E}, poi {P} con {G} e {H}.","So, two {E}, then {P} with {G} and {H}.","Deci, de două ori {E}, apoi {P} cu {G} și {H}."),
  L('C',"C'est ça. Et deux cafés à la fin.","Да, всё верно. И два кофе в конце.","Eso es. Y dos cafés al final.","Esatto. E due caffè alla fine.","That's right. And two coffees at the end.","Exact. Și două cafele la final."),
  L('C',"C'était délicieux ! L'addition, s'il vous plaît.","Было очень вкусно! Счёт, пожалуйста.","¡Estaba delicioso! La cuenta, por favor.","Era delizioso! Il conto, per favore.","That was delicious! The bill, please.","A fost delicios! Nota, vă rog."),
  L('S',"Ça fait {TOTE}, cafés compris.","С вас {TOTE}, включая кофе.","Son {TOTE}, cafés incluidos.","Sono {TOTE}, caffè compresi.","That's {TOTE}, including the coffees.","Face {TOTE}, cu tot cu cafelele."),
  L('C',"Je peux payer par carte ?","Можно оплатить картой?","¿Puedo pagar con tarjeta?","Posso pagare con la carta?","Can I pay by card?","Pot plăti cu cardul?"),
  L('S',"Bien sûr. Merci et bonne soirée !","Конечно. Спасибо и хорошего вечера!","Por supuesto. ¡Gracias y buenas noches!","Certo. Grazie e buona serata!","Of course. Thank you and have a nice evening!","Desigur. Mulțumim și o seară bună!")
 ]}
];


export { LANGS, ORDER, CATS, CAT_ORDER, SLOT_LABEL, PHRASE_CATS, DEFAULT_DISHES, DIALOGUES };
