;"use strict";
// 定义全局变量，高亮敏感词方法，需要在viewer.js中调用该方法
// 当pdf页面改变时，就需要调用此方法
var myHighlightSensitiveWords;
;$(function(){
	console.log('加载pdfjs插件扩展');
	//	console.log(pdfjsLib);
	//	
	//	console.log(document.readyState);
	
	// 定义所有的敏感词
	var allSensitiveWords = [{
		id:1,
		word:'number',
		discription: '描述描述11111111111',
		order: '二级'
	}, {
		id: 2,
		word:'are',
		discription: '描述描述21212131111122222',
		order: '一级'
	}, {
		id: 3,
		word:'used',
		discription: '描述描述3333333333333333333',
		order: '三级'
	}, {
		id: 4,
		word:'is',
		discription: '描述描述444444444',
		order: '一级'
	}, {
		id: 5,
		word:'with',
		discription: '描述描述51231312312',
		order: '二级'
	}];
	// 定义当前pdf页码
	var currentPageNum = 1; 
	// 定义当前页拥有的敏感词
	var currentPageSensitiveWords = [];
	// 定义当前页的文档内容
	var currentPageTxt = '';
	// 敏感词弹窗是否显示，默认不显示
	var sensitiveWordsLayerIsShow = false;
	
	/**
	 * 获取当前页的文档内容
	 **/
	var getCurrentPageTxt = function(){
		currentPageTxt = $('#viewer').find('[data-page-number='+ currentPageNum +']').find('.textLayer').text();
	}
	
	/**
	 * 获取当前页拥有的敏感词
	 **/
	var getCurrentPageSensitiveWords = function(){
		for(var i=0; i<allSensitiveWords.length; i++){
			if(currentPageTxt.indexOf(allSensitiveWords[i].word) != -1){
				currentPageSensitiveWords.push(allSensitiveWords[i]);
			}
		}
//		console.log(currentPageSensitiveWords);
	}
	
	/**
	 * 清空pdf所有高亮显示的敏感词
	 **/
	var removePdfHighlight = function(){
		 $('#viewer').find('.highlight').removeClass('highlight');
	}
	
	/**
	 * 当前页对敏感词进行高亮
	 **/
	var setCurrentPageHighlight = function(){
		 for(var i=0; i<currentPageSensitiveWords.length; i++){
		 	$('#viewer').find('[data-page-number='+ currentPageNum +']').find('.textLayer').highlight(currentPageSensitiveWords[i].word);
		 }
	}
	
	/**
	 * 设置敏感词列表弹窗的dom片段
	 **/
	var setSensitiveWordsLayerDom = function(){
		var htmlPart = '';
		var htmlItemPart = '';
		if(currentPageSensitiveWords.length === 0){
			htmlPart = '<div class="sensitive-words-empty">无</div>';
		}else{
			htmlPart += '<ol class="sensitive-words-list">';
			for(var i=0; i<currentPageSensitiveWords.length; i++){
				htmlItemPart = '<li class="sensitive-words-item">\
				        			<div class="sensitive-words-base">\
				        				<span class="word-wrap">敏感词：<span class="word">'+ currentPageSensitiveWords[i].word +'</span></span>\
				        				<span class="order-wrap">敏感词级别：<span class="order">'+ currentPageSensitiveWords[i].order +'</span></span>\
				        			</div>\
				        			<div class="sensitive-words-info">编辑提示：建议使用“残疾人”。请确认是否仍然使用该词。</div>\
				        		</li>';
	        	htmlPart += htmlItemPart;
			}
			
			htmlPart += '</ol>';
		}
		
		$('#sensitive-words-layer-main').empty().html(htmlPart);
		$('#sensitive-words-pagenum').empty().text(currentPageNum);
	}
	
	/**
	 * 定义高亮当前页所有敏感词
	 * @param pn {Number} 当前页码
	 **/
	myHighlightSensitiveWords = function(pn){
		// 设置当前页码
		currentPageNum = parseInt(pn);
		// 重置当前页拥有的敏感词为空
		currentPageSensitiveWords = [];
		// 重置当前页的pdf文档为空
		currentPageTxt = '';
		// 设置当前页的pdf文档
		getCurrentPageTxt();
		// 设置当前页拥有的敏感词
		getCurrentPageSensitiveWords();
		
		// 当敏感词列表弹窗显示时,进行的操作
		if(sensitiveWordsLayerIsShow){
			// 清空pdf所有的高亮显示
			removePdfHighlight();
			// 当前页对敏感词进行高亮
			setCurrentPageHighlight();
			// 设置敏感词列表弹窗的dom片段
			setSensitiveWordsLayerDom();
		}
		
		
	}
	
	/**
	 * 敏感词按钮,绑定事件,控制敏感词列表弹窗显示和隐藏
	 **/
	$('#sensitive-word-btn').on('click', function(){
		var $sensitiveWordsLayer = $('#sensitive-words-layer');
		// 清空pdf所有的高亮显示
		removePdfHighlight();
		// 打开敏感词列表弹窗
		if(sensitiveWordsLayerIsShow === false){
			// 当前页对敏感词进行高亮
			setCurrentPageHighlight();
			// 设置敏感词列表弹窗的dom片段
			setSensitiveWordsLayerDom();
			// 打开敏感词列表弹窗
			$sensitiveWordsLayer.show();
		}else{
			// 关闭弹窗
			// 关闭敏感词列表弹窗
			$sensitiveWordsLayer.hide();
		}
		
		sensitiveWordsLayerIsShow = !sensitiveWordsLayerIsShow;
	})
	
	/**
	 * 敏感词列表弹窗关闭按钮点击事件,关闭弹窗
	 **/
	$('#sensitive-words-close-btn').on('click', function(){
		var $sensitiveWordsLayer = $('#sensitive-words-layer');
		// 清空pdf所有的高亮显示
		removePdfHighlight();
		// 关闭敏感词列表弹窗
		$sensitiveWordsLayer.hide();
		sensitiveWordsLayerIsShow = false;
	})
})
