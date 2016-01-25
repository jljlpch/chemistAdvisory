/*
	'yszx':药师咨询
	'cjb'：常见病
	'ek'：儿科
	'fk'；妇科
	'mxb'：慢性病
	'nk':男科
	'pfk':皮肤科
	'wgk':五官科
*/
window.website='yszx';
switch(window.website){
	case 'yszx':{
	    add('yszx');
	    break;
	}
	case 'cjb':{
	    add('cjb');
	    break;
	}
	case 'ek':{
	    add('ek');
	    break;
	}
	case 'fk':{
	    add('fk');
	    break;
	}
	case 'mxb':{
	    add('mxb');
	    break;
	}
	case 'nk':{
	    add('nk');
	    break;
	}
	case 'pfk':{
	    add('pfk');
	    break;
	}
	case 'wgk':{
	    add('wgk');
	    break;
	}
	default : break;
}
function add(str){
	addCss(str);
	addTitle(str);
    addBaiduTongji(str);
}
function addCss(str){
    var link=document.createElement('link');
    link.rel="stylesheet";
    link.type="text/css";
    link.href="./app/css/"+str+'.css';
    document.head.appendChild(link);
}

function addTitle(str){
    var title=document.createElement('title');
    switch(str){
	    case 'yszx':{
		    title.innerHTML='药事咨询 - 药到病除，正确用药比什么都重要。';
		    break;
    	}
    	case 'cjb':{
		    title.innerHTML='久经考验的常用药，药品常识，我有一套。';
		    break;
    	}
    	case 'ek':{
		    title.innerHTML='儿童用药不靠掰，剂量不靠猜，问问药师，so easy。';
		    break;
    	}
    	case 'fk':{
		    title.innerHTML='解决女性疾病困扰，用药难题一网打尽。';
		    break;
    	}
    	case 'mxb':{
		    title.innerHTML='慢病井喷，快来定制你的用药小锦囊。';
		    break;
    	}
    	case 'nk':{
		    title.innerHTML='“男”言之隐，让您用药时也能够明察秋毫。';
		    break;
    	}
    	case 'pfk':{
		    title.innerHTML='调“皮”有道，御“肤”有方。';
		    break;
    	}
    	case 'wgk':{
		    title.innerHTML='给五官用药，看剂型办事。';
		    break;
    	}
    	default : break;
    }
    document.head.appendChild(title);
}

function addBaiduTongji(str){
	var script=document.createElement('script');
	script.src='./baidu/'+str+'Tongji.js';
	document.head.appendChild(script);
}