
layui.define(['table', 'form','soulTable','upload','tableEdit','tableTree','xmSelect','layedit'], function(exports) {
	var $ = layui.$,
		form = layui.form,
		table = layui.table,
		layer = layui.layer,
		upload =  layui.upload,
		tableEdit = layui.tableEdit,
		tableTree =  layui.tableTree,
		xmSelect =  layui.xmSelect,
		layedit =  layui.layedit,
		soulTable = layui.soulTable;
	var fieldJson = {}//加载事件
    var adminInfo;
    
	//监听省下拉框选择
		form.on('select(province)', function (data) {
            //触发内容
            $('.county-selector').html('<option value="">请先选择县</option>');
            var a = form.render('select');
	        a = null
			o.createArea.getCity({
    			pid:data,
    			isSreach:true
    		})
			
        });
        //监听区下拉框选择
		form.on('select(city)', function (data) {
            //触发内容
			o.createArea.getShipping({
    			pid:data,
    			isSreach:true
    		})
        });
    
    // 后台分页
    var o = {
//  	basicUrl : 'http://lx.1024xxkj.com/',
		basicUrl : 'https://sst.dalaokj.com/',
		basicUrl1 : 'https://api.dalaokj.com:8081/',
//  	imgUrl: 'http://122.51.251.54:8088/file/show?fileName=',
    	imgUrl: 'https://sst.dalaokj.com/',
    	options:{
    		fieldJsons : {},
    		ele:'',
    		isSreach : true,
    		height:630,
    		token:'',
    		elem:'',
    		userId:'',
    		shopId:'',
    		info:{}
    	},
    	init:function(opt){
    		o.options.id = opt.id || 'LAY-user-manage';
    		o.options.where = opt.fieldJson || {};
    		o.options.fieldJsons = opt.fieldJson || {};
    		o.options.isSreach = opt.isSreach || true;
    		o.options.height = opt.height || 630;
//  		o.options.elem = opt.elem || '#LAY-user-manage';
    		if(o.options.isSreach!='login'){
//				o.options.token = o.cookies.get('token') || '';
//				o.options.userId = o.cookies.get('userInfo').id || '1';
			    if(o.cookies.get('qx')){
			    	try{
			    		adminInfo = o.cookies.get('qx');
				    	id = adminInfo.id;
				    	o.options.info = adminInfo;
				    	o.options.token = adminInfo.token;
			    	}catch(x){
			    		location.href='./login.html'
			    	}
			    	
//			    	o.options.userId = adminInfo.u_id;
//			    	if(adminInfo.storeinfo.length>0){
//			    		o.options.shopId = adminInfo.storeinfo[0].store_id;
//			    	}
			    	
			    }else{
//			    	location.hash = '/login';
			    	location.href='./login.html'
//			    	window.parent.parent.location.href='./login.html'
//			    	window.location.href='/login.html'
			    }
			    if(o.options.isSreach){
			    	o.sreach();
					o.clear();
			    }
			}
    	},
    	back:function(){
    		location.hash = '/login'
    	},
    	/**公用查询
    	 * *************/
    	sreach:function(){
    		form.on('submit(searchFilter)', function(data){
		      	field = data.field;
		      	o.options.fieldJsons = eval('(' + (JSON.stringify(o.options.where) + JSON.stringify(field)).replace(/}{/, ',') + ')');
				for(k in o.options.fieldJsons){
					if(k.indexOf('time')){
						var arrtimes = o.options.fieldJsons[k].split(' - ');
						o.options.fieldJsons[k+'1'] = arrtimes[0];
						o.options.fieldJsons[k+'2'] = arrtimes[1];
					}
				}
		      	//执行重载
		      	table.reload(o.options.id, {
		        	where: o.options.fieldJsons
		      	});
		    });
    	},
    	/**公用清除查询条件
    	 * *************/
    	clear:function(){
    		form.on('submit(clearFilter)', function(data){
		      	$(".searchClear").val('');
		      	field = data.field;
		      	for(let key in field){
		      		field[key] = ''
		      	}
		      	o.options.fieldJsons = eval('(' + (JSON.stringify(o.options.where) + JSON.stringify(field)).replace(/}{/, ',') + ')');
		      	//执行重载,清空回到第一页
		      	table.reload(o.options.id, {
		      		where: o.options.fieldJsons,
		      		page: {
		            	curr: 1
		       		}
		      	});
		    });
    	},
    	/**编辑页面赋值，现在做了radio,input,select,textarea的赋值
    	 * *************/
    	setEdit:function(opt){
    		opt.id = opt.id || "#formArea";
    		opt.layero = opt.layero || opt.layero;
    		opt.data = opt.data || opt.data;
    		opt.success = opt.success || function(){}
    		//给iframe元素赋值
          	var othis = (opt.layero).find('iframe').contents().find(opt.id).click();
          	//便利input的name
          	var inputName = [],selectName = [],textareaName = [],radioName = [],
          		imgName = [],treeInput = [],areaInput = [],xmSelects=[],imgsName = [];
          	othis.find('input').each(function(){inputName.push(this.name)});
          	othis.find('select').each(function(){selectName.push(this.name)});
          	othis.find('textarea').each(function(){textareaName.push(this.name)});
          	othis.find('input[type="radio"]').each(function(){radioName.push(this.name)});
          	othis.find('.layui-upload-img').each(function(){imgName.push(this.name)});
          	othis.find('.treeInput').each(function(){
          		treeInput.push(this.name)
          	});
          	othis.find('.imgupload').each(function(){
          		imgsName.push(this.attributes["name"].nodeValue)
          	});
          	othis.find('.xmSelects').each(function(){
          		xmSelects.push(this.attributes["name"].nodeValue)
          	});
          	
          	othis.find('.area').each(function(){
          		areaInput.push(this.name)
          	});
          	var data = opt.data;
          	a:for(let key in data){
          		if(radioName.indexOf(key)>-1){
          			othis.find('input[name="'+key+'"][value="'+data[key]+'"]').prop('checked','checked');
          		}else if(imgsName.indexOf(key)>-1){
          			var item = data[key]
          			for(i in item){
          				if((item[i].goods_imgs).indexOf("http")<0){
          					item[i].goods_imgs = o.imgUrl + item[i].goods_imgs
          				}
          				var htm = '<div class="layui-upload-list">'
								+ '<img class="layui-upload-img" name="icon" id="'+item[i].goodsimg_id+'" src="'+item[i].goods_imgs+'">'
								+ '<p id="demoText"></p>'
								+ '<i class="layui-icon layui-icon-close"></i>'
								+ '</div>'
						$('.imgupload .layui-upload').prepend(htm);
          			}
//        			if(data[key])othis.find('.layui-upload-img[name="'+key+'"]').attr('src', data[key]);
          		}else if(imgName.indexOf(key)>-1){
          			if(data[key])othis.find('.layui-upload-img[name="'+key+'"]').attr('src', data[key]);
          		}else if(treeInput.indexOf(key)>-1){
          			othis.find('input[name="'+key+'"]').attr('vals',data[key])
          		}else if(xmSelects.indexOf(key)>-1){
          			othis.find('#'+key).attr('vals',data[key])
          		}else if(inputName.indexOf(key)>-1){
          			othis.find('input[name="'+key+'"]').val(data[key]);
          		}else if(selectName.indexOf(key)>-1||areaInput.indexOf(key)>-1){
          			othis.find('select[name="'+key+'"]').attr('vals',parseInt(data[key]));
          			othis.find('select[name="'+key+'"]').val(parseInt(data[key]));
          		}else if(textareaName.indexOf(key)>-1){
          			othis.find('textarea[name="'+key+'"]').val(data[key]);
          		}
          	}
          	opt.success();
    	},
    	/**编辑页面获取，现在做了radio,input,select,textarea的赋值
    	 * *************/
    	getEdit:function(layero){
			var othis = layero.find('iframe').contents().find("#formArea")
          	var upData = {}
          	var inputName = [],selectName = [],textareaName = [],radioName = [];
          	othis.find('.layui-input').each(function(){
          		if(this.name!=''){
          			upData[this.name]=this.value
          		}
          	});
          	othis.find('select').each(function(){
          		upData[this.name]=this.value
          	});
          	othis.find('textarea').each(function(){
          		upData[this.name]=this.value
          	});
          	othis.find('.imgupload').each(function(){
          		var arrimg = [];
          		var _this = this
          		
          		othis.find('.imgupload img').each(function(){
          			arrimg.push(this.attributes["src"].nodeValue);
          		});
          		upData[_this.attributes["name"].nodeValue]=arrimg;
          	});
          	othis.find('.xmSelects').each(function(){
//        		upData[this.attributes['name'].nodeValue]=xmSelect.get('#'+this.attributes['name'].nodeValue);
          		upData[this.attributes['name'].nodeValue]=this.attributes['vals'].nodeValue;
//        		console.log(this.attributes['name'].nodeValue)
          	});
          	
          	othis.find('input[type="radio"]:checked').each(function(){
          		upData[this.name]=this.value
          	});
          	othis.find('input[treeId]').each(function(){
          		upData[this.attributes["treeid"].nodeValue]=this.attributes["data-val"].nodeValue;
          		upData[this.attributes["treename"].nodeValue]=this.value
          	});
          	othis.find('input.treeInput').each(function(){
          		upData[this.name]=this.attributes["vals"].nodeValue;
          	});
          	othis.find('input.area').each(function(){
          		upData[this.name]=this.value;
          	});
          	othis.find('.layui-upload-img').each(function(){
          		upData[this.name]=  this.src
          	});
          	return upData;
		},
    	/*******************************************************************/
    	/**创建正常下拉列表
    	 * 可增加联动回调
    	 * 用法tool.createSelect({ele:'#id',url:'',data:{},val:'',name:''，success:function(){}})
    	 * **/
    	createSelect:function(opt){
    		
    		if(opt.url){
    			opt.ele = opt.ele || '';
    			opt.spl = opt.spl || function(data){return data.list}
//  			opt.edit = opt.edit || '-1';
//  			var editId = opt.edit() || '-1';
    			opt.success = opt.success || function(data){
					data = opt.spl(data) || data.list;
					var htm = '';
					opt.val = opt.value || 'id';
	    			opt.name = opt.name || 'name';
	    			var vals = $(opt.ele).attr('vals') || -999;
					(data).forEach(function(item ,index){
						if(vals==item[opt.val]){
							htm += ' <option selected value="'+ item[opt.val] +'">'+ item[opt.name] +'</option>'
						}else{
							htm += ' <option value="'+ item[opt.val] +'">'+ item[opt.name] +'</option>'
						}
						
					})
					$(opt.ele).html(htm);
					form.render("select");
				};
    			o.ajaxAsyncTrue({
					url:   opt.url ,
					data: opt.data || {},
					success:function(data){
						opt.success(data)
					}
				})
    		}else{
    			return false;
    		}	
    	},
    	createArea : {
        	getProvince:function(isSreach){
        		isSreach = isSreach || 'false';
        		o.createSelect({
	            	url:'index/Province?pid=0',
	            	success:function(res){
	            		var proHtm = ''
	            		if(isSreach){
	            			proHtm = '<option value="">请选择省</option>'
	            		}else{
	            			proHtm = '<option value="all">全部</option>'
	            		}
	            		var vals = $('.province-selector').attr('vals'),isEdit = false;
	            		res.forEach(function(item ,index){
	            			if(vals == item.id){
	            				proHtm += '<option value="'+ item.id +'" selected>'+ item.name +'</option>';
	            				isEdit = !isEdit;
	            			}else{
	            				proHtm += '<option value="'+ item.id +'">'+ item.name +'</option>';
	            			}
	            		})
	            		$('.province-selector').html(proHtm);
	            		var a = form.render('select');
	            		a = null
						if(isEdit){
							o.createArea.getCity({
								pid:{
									value:vals
								},
    							isSreach:true
							})
						}
	            	}
	            })
        	},
        	//获取市/区
        	getCity:function(opt){
        		o.createSelect({
	            	url:'index/Province',
	            	data:{pid:opt.pid.value},
	            	success:function(res){
	            		var proHtm = ''
	            		if(opt.isSreach){
	            			proHtm = '<option value="">请选择市/区</option>'
	            		}else{
	            			proHtm = '<option value="all">全部</option>'
	            		}
	            		var vals = $('.city-selector').attr('vals'),isEdit = false;
	            		res.forEach(function(item ,index){
	            			if(vals == item.id){
	            				proHtm += '<option value="'+ item.id +'" selected>'+ item.name +'</option>';
	            				isEdit = !isEdit;
	            			}else{
	            				proHtm += '<option value="'+ item.id +'">'+ item.name +'</option>';
	            			}
	            			
	            		})
	            		$('.city-selector').html(proHtm);
	            		var a = form.render('select');
	            		a = null
						if(isEdit){
							o.createArea.getShipping({
								pid:{
									value:vals
								},
    							isSreach:true
							})
						}
	            		
	            	}
	            })
        	},
        	//获取市
        	getShipping:function(opt){
        		o.createSelect({
	            	url:'index/Province',
	            	data:{pid:opt.pid.value},
	            	success:function(res){
	            		if(opt.isSreach){
	            			proHtm = '<option value="">请先选择县</option>'
	            		}else{
	            			proHtm = '<option value="all">全部</option>'
	            		}
	            		var vals = $('.county-selector').attr('vals'),isEdit = false;
	            		res.forEach(function(item ,index){
	            			if(vals == item.id){
	            				proHtm += '<option value="'+ item.id +'" selected>'+ item.name +'</option>';
	            				isEdit = !isEdit;
	            			}else{
	            				proHtm += '<option value="'+ item.id +'">'+ item.name +'</option>';
	            			}
	            		})
	            		$('.county-selector').html(proHtm);
	            		var a = form.render('select');
	            		a = null
	            	}
	            })
        	}
        },
    	/*********************************ajax相关**********************************/
    	/**处理上传参数
    	 * **/
    	handleUrl:function(url,data){
    		var dataUrl,count = 0;
			if(url.indexOf('?')>0){
				dataUrl = url+'&'
			}else{
				dataUrl = url+'?'
			}
    		if("string" == typeof data){
    			data = eval('(' + data + ')');
    		}
    		for(let key  in data){
    			if(count==0){
    				dataUrl += key +'='+ data[key]
    			}else{
    				dataUrl += '&'+key +'='+ data[key]
    			}
		        count ++;
		  	}
    		return dataUrl;
    	},
    	/**tableAjax需要根据业务处理一下数据
    	 * **/
    	tableAjax:function(opt){
    		opt.id = opt.id || o.options.id;
    		opt.elem = opt.elem || '#'+o.options.id;
    		opt.url = opt.url || '';
    		opt.data = opt.data || o.options.fieldJsons;//精髓
    		opt.toolbar = opt.toolbar || '#toolbar';
    		opt.cols = opt.cols || [[{type: 'checkbox',fixed: 'left'}, {field: 'id',width: 80,title: 'ID',sort: true}]];
    		opt.height = opt.height || o.options.height;
    		opt.limit = opt.limit ||  10;
    		opt.success = opt.success ||  function(){};
    		opt.handleRes = opt.handleRes || function(s){return s};
    		opt.handleData = opt.handleData || function(res){
    			//正确格式："code":0,"msg":"","count":1000,"data":[]
				/*************************************/
				var t = {};
				try{
					t.code=res.code;t.msg = res.message;t.count = res.data.total;t.data = res.data.data;
					t.data = opt.handleRes(t.data)
				}catch{
					t.code=-1;
				}
				if(t.code==400){
					location.href = '../../login.html'
				};
				return t;
				/*************************************/
    		}
    		if(!o.options.token||o.options.token==''){
    			o.back()
    		}
    		table.render({
    			id: opt.id,
				elem: opt.elem,
				url:  o.basicUrl + opt.url, //模拟接口
				where: opt.data,//查询条件
				method:'post',
				headers:{token:o.options.token},
				toolbar: opt.toolbar,
				height: opt.height,
				handleData:opt.handleData,
				overflow: 'tips',
    			cols:opt.cols,
				page: true,
				limit: opt.limit,
				limits: [10, 20, 50, 100, 10000],
				text: '对不起，加载出现异常！',
				done: function() {
					soulTable.render(this);
					opt.success()
				}
				
			});
    	},
    	/**fsy单独写法
    	 * **/
    	tableAjax1:function(opt){
    		opt.id = opt.id || o.options.id;
    		opt.elem = opt.elem || '#'+o.options.id;
    		opt.url = opt.url || '';
    		opt.data = opt.data || o.options.fieldJsons;//精髓
    		opt.toolbar = opt.toolbar || '#toolbar';
    		opt.cols = opt.cols || [[{type: 'checkbox',fixed: 'left'}, {field: 'id',width: 80,title: 'ID',sort: true}]];
    		opt.height = opt.height || o.options.height;
    		opt.limit = opt.limit ||  10;
    		opt.success = opt.success ||  function(){};
    		opt.handleRes = opt.handleRes || function(s){return s};
    		opt.handleData = opt.handleData || function(res){
    			//正确格式："code":0,"msg":"","count":1000,"data":[]
				/*************************************/
				var t = {};
				try{
					t.code=res.code;t.msg = res.message;t.count = res.data.total;t.data = res.data.data;
					t.data = opt.handleRes(t.data)
				}catch{
					t.code=-1;
				}
				if(t.code==400){
					location.href = '../../login.html'
				};
				return t;
				/*************************************/
    		}
    		if(!o.options.token||o.options.token==''){
    			o.back()
    		}
    		table.render({
    			id: opt.id,
				elem: opt.elem,
				url:  o.basicUrl1 + opt.url, //模拟接口
				where: opt.data,//查询条件
				method:'post',
				headers:{token:o.options.token},
				toolbar: opt.toolbar,
				height: opt.height,
				handleData:opt.handleData,
				overflow: 'tips',
    			cols:opt.cols,
				page: true,
				limit: opt.limit,
				limits: [10, 20, 50, 100, 10000],
				text: '对不起，加载出现异常！',
				done: function() {
					soulTable.render(this);
					opt.success()
				}
				
			});
    	},
    	/**第三方调取新闻接口等
    	 * **/
    	tableAjaxS:function(opt){
    		opt.id = opt.id || o.options.id;
    		opt.elem = opt.elem || '#'+o.options.id;
    		opt.url = o.handleUrl(opt.url || '',opt.data || o.options.fieldJsons);
    		opt.data = opt.data || o.options.fieldJsons;//精髓
    		opt.toolbar = opt.toolbar || '#toolbar';
    		opt.cols = opt.cols || [[{type: 'checkbox',fixed: 'left'}, {field: 'id',width: 80,title: 'ID',sort: true}]];
    		opt.height = opt.height || o.options.height;
    		opt.limit = opt.limit ||  10;
    		opt.success = opt.success ||  function(){};
    		opt.handleRes = opt.handleRes || function(s){return s};
    		opt.handleData = opt.handleData || function(res){
    			//正确格式："code":0,"msg":"","count":1000,"data":[]
				/*************************************/
				var t = {};
				try{
					t.code=res.code;t.msg = res.message;t.count = res.data.total;t.data = res.data.data;
					t.data = opt.handleRes(t.data)
				}catch{
					t.code=-1;
				}
				if(t.code==400){
					location.href = '../../login.html'
				};
				return t;
				/*************************************/
    		}
    		if(!o.options.token||o.options.token==''){
    			o.back()
    		}
    		table.render({
    			id: opt.id,
				elem: opt.elem,
				url:  opt.url, //模拟接口
				where: opt.data,//查询条件
				method:'post',
				headers:{token:o.options.token},
				toolbar: opt.toolbar,
				height: opt.height,
				handleData:opt.handleData,
				overflow: 'tips',
    			cols:opt.cols,
				page: true,
				limit: opt.limit,
				limits: [20],
				text: '对不起，加载出现异常！',
				done: function() {
					soulTable.render(this);
					opt.success()
				}
				
			});
    	},
    	tableTree:function(opt){
    		opt.id = opt.id || o.options.id;
    		opt.elem = opt.elem || '#'+o.options.id;
    		opt.url = opt.url || '';
    		opt.data = opt.data || o.options.fieldJsons;//精髓
    		opt.toolbar = opt.toolbar || '#toolbar';
    		opt.cols = opt.cols || [[{type: 'checkbox',fixed: 'left'}, {field: 'id',width: 80,title: 'ID',sort: true}]];
    		opt.height = opt.height || o.options.height;
    		opt.success = opt.success ||  function(){};
    		opt.handleRes = opt.handleRes || function(s){return s};
    		opt.defaultToolbar = opt.defaultToolbar ||['filter', 'exports', 'print', { //自定义头部工具栏右侧图标。如无需自定义，去除该参数即可
                title: '提示'
                ,layEvent: 'LAYTABLE_TIPS'
                ,icon: 'layui-icon-tips'
            }]
    		opt.treeConfig = opt.treeConfig || { //表格树所需配置
                showField:'shopName' //表格树显示的字段
                ,treeid:'id' //treeid所对应字段的值在表格数据中必须是唯一的，且不能为空。
                ,treepid:'pid'//父级id字段名称
                ,iconClass:'layui-icon-right' //小图标class样式 窗口图标 layui-icon-layer
                ,showToolbar: false //展示工具栏 false不展示 true展示
            }
    		opt.handleData = opt.handleData || function(res){
    			//正确格式："code":0,"msg":"","count":1000,"data":[]
				/*************************************/
				var t = {};
				try{
					t.code=res.code;t.msg = res.message;t.count = res.data.total;t.data = res.data.list;
//					t.code=res.code;t.msg = res.msg;t.count = res.count;t.data = res.data;
					t.data = opt.handleRes(t.data)
					
				}catch{
					t.code=-1;
				}
				if(t.code==400){
					location.href = '../../login.html'
				};
				return t;
				/*************************************/
    		}
    		if(!o.options.token||o.options.token==''){
    			o.back();
    		}
    		tableTree.render({
//  			id: opt.id,
//				elem: opt.elem,
//				url:  'http://127.0.0.1:8020/layuiAdmin.std-v1.4.0/src/QXviews/admin/ceshi/data/data.json' , //模拟接口o.basicUrl+ opt.url
//				data: opt.data,//查询条件
//				method:'get',
    			id: opt.id,
				elem: opt.elem,
				url:  o.basicUrl+ opt.url , //模拟接口o.basicUrl+ opt.url
				data: opt.data,//查询条件
				method:'post',
				size:'sl',
				headers:{token:o.options.token},
				toolbar: opt.toolbar,
				height: opt.height,
				defaultToolbar: opt.defaultToolbar,
				handleData:opt.handleData,
				treeConfig:opt.treeConfig,
				overflow: 'tips',
    			cols:opt.cols,
				page: true,
				limit: 10,
				limits: [10, 20, 50, 100, 10000],
				text: '对不起，加载出现异常！',
				done: function() {
					opt.success()
				}
            })
    	},
    	ajax:function(opt){
    		opt.url = opt.url || ''
    		opt.data = opt.data || o.options.fieldJsons;//精髓
    		opt.success = opt.success || function(){};
    		opt.error = opt.error || function(data){
    			layer.msg(data.msg)
    		};
    		$.ajax({
	            type: "post",
	            url:  o.basicUrl + opt.url,
	            data: opt.data,
	            async:false,
	            headers:{token:o.options.token},
	            dataType: "json",
	            success: function(data){
	            	if(data.code==200){
	            		opt.success(data.data)
	            	}else{
	            		opt.error(data)
	            	}
	            }
	            
	      	})
    	},
    	ajaxAsyncTrue:function(opt){
    		opt.url = opt.url || ''
    		opt.data = opt.data || o.options.fieldJsons;//精髓
    		opt.success = opt.success || function(){}
    		$.ajax({
	            type: "post",
	            url: o.basicUrl + opt.url,
	            data: opt.data,
	            async:false,
	            headers:{token:o.options.token},
	            dataType: "json",
	            success: function(data){
	            	if(data.code==200){
	            		opt.success(data.data)
	            	}
	            }
	      })
    	},
    	imgAjax :function(opt){
    		opt.id = opt.id || '#test1';;
    		opt.imgId = opt.imgId || '#demo1';
    		opt.type = opt.type || false;
    		opt.success = opt.success || function(res){
    			if(!opt.type){
					$(opt.imgId).attr('src', o.imgUrl + res.data.part);
				}else{
					$('.imgupload .layui-upload .layui-upload-list').eq(0).find('img').attr('src', o.imgUrl + res.data.part);
				}
    		};
    		opt.error = opt.error || function(){
    			layer.msg('图片上传失败');
				$('.imgupload .layui-upload .layui-upload-list').eq(0).remove()
    		};
    		upload.render({
				elem: opt.id,
//				url: o.basicUrl + 'file/multipleImageUpload', //改成您自己的上传接口
				url: o.basicUrl + 'order/ImageUploading', //改成您自己的上传接口
				handleData:function(l){
					var formdata =  new FormData;
					formdata.append('file', l);
					return formdata;
				},
				headers:{token:o.options.token},
				before: function(obj) {
					//预读本地文件示例，不支持ie8
					obj.preview(function(index, file, result) {
						if(!opt.type){
							$(opt.imgId).attr('src', result); //图片链接（base64）
						}else{
							var htm = '<div class="layui-upload-list">'
									+ '<img class="layui-upload-img" src="'+result+'">'
									+ '<p id="demoText"></p>'
									+ '<i class="layui-icon layui-icon-close"></i>'
									+ '</div>'
							$('.imgupload .layui-upload').prepend(htm);
						}
					});
				},
				success:function(res){
					if(res.code==200){
						opt.success();
//						$('.imgupload .layui-upload .layui-upload-list').eq(0).find('img').attr('src', o.imgUrl + res.data.part);
					}else{
						opt.error();
					}
//					console.log(res);
				},
				done: function(a,b,c) {
					//如果上传失败
					res = a;
//					res = (res.imgStr);
					if(res.code==200){
						opt.success(res);
//						$('.imgupload .layui-upload .layui-upload-list').eq(0).find('img').attr('src', o.imgUrl + res.data.part);
					}else{
						opt.error();
					}
//					if(res.indexOf('images')<0){
//						layer.msg('图片上传失败1');
//						$('.imgupload .layui-upload .layui-upload-list').eq(0).remove()
//					}else{
//						if(!opt.type){
//							$(opt.imgId).attr('src', o.imgUrl + res);
//						}else{
//							$('.imgupload .layui-upload .layui-upload-list').eq(0).find('img').attr('src', o.imgUrl + res);
//						}
						
//						$(opt.imgId).attr('src', o.imgUrl + res);
//						var htm = '<div class="layui-upload-list">'
//								+ '<img class="layui-upload-img" name="icon" src="'+o.imgUrl + res+'">'
//								+ '<p id="demoText"></p>'
//								+ '<i class="layui-icon layui-icon-close"></i>'
//								+ '</div>'
//						$('.imgupload .layui-upload').before(htm);ss
//					}
				},
				error: function() {
					layer.msg('图片上传失败');
					$('.imgupload .layui-upload .layui-upload-list').eq(0).remove()
				}
			});
    	},
    	/*********************************ajax相关end**********************************/
    	getMethod:function (queryName) {
		    var query = decodeURI(window.location.search.substring(1));
		    var vars = query.split("&");
		    for (var i = 0; i < vars.length; i++) {
		        var pair = vars[i].split("=");
		        if (pair[0] == queryName) { return pair[1]; }
		    }
		    return null;
		},
		//Json数值处理
		json_encode:function (obj) {
		    return JSON.stringify(obj)
		},
		json_decode:function (s) {
		    var j = eval('(' + s + ')');
		    return j;
		},
		//tool.toTreeData(res.list)
		toTreeData:function(data){
			var arr=[];
			var datas = data.map(function(item,index){
				item.title = item.name
	            return item
	        })
			o.toTree(0,arr,datas)
			return arr;
		},
		toTableTreeData:function(data){
			var arr=[];
			o.toTree1(0,arr,data)
			return arr;
		},
		toTreeDataAll:function(data,opt){
			opt.id = opt.id || 'id';
			opt.pid = opt.pid || 'pid';
			opt.children = opt.children || 'children';
			var arr=[];
			var datas = data.map(function(item,index){
				item.title = item.name
	            return item
	        })
			o.toTreeAll(0,arr,datas,opt)
			return arr;
		},
		toTreeAll:function (id,array,list,opt){
		    let newArr = list.filter(item=> ("number" == typeof item[opt.pid] ? item[opt.pid] : parseInt(item[opt.pid])) === ("number" == typeof id ? id : parseInt(id)) );
		    newArr.forEach(item=>{
		      	let arr = [];
		      	item[opt.children] = o.toTreeAll(item[opt.id],arr,list);
		      	array.push(item);
		    });
		    return array;
	  	},
		toTree:function (id,array,list){
		    let newArr = list.filter(item=> ("number" == typeof item.pid ? item.pid : parseInt(item.pid)) === ("number" == typeof id ? id : parseInt(id)) );
		    newArr.forEach(item=>{
		      	let arr = [];
		      	item.children = o.toTree(item.id,arr,list);
		      	array.push(item);
		    });
		    return array;
	  	},
		toTree1:function (id,array,list){
		    let newArr = list.filter(item=> ("number" == typeof item.pid ? item.pid : parseInt(item.pid)) === ("number" == typeof id ? id : parseInt(id)) );
		    newArr.forEach(item=>{
		      	let arr = [];
		      	item.treeList = o.toTree(item.id,arr,list);
		      	array.push(item);
		    });
		    return array;
	  	},
		toTree2:function (id,array,list){
		    let newArr = list.filter(item=> ("number" == typeof item.pid ? item.pid : parseInt(item.pid)) === ("number" == typeof id ? id : parseInt(id)) );
		    newArr.forEach(item=>{
		      	let arr = [];
		      	item.treeList = o.toTree(item.id,arr,list);
		      	array.push(item);
		    });
		    return array;
	  	},
		//获取当前时间戳
		time:function () {
		    return Math.floor(new Date().getTime() / 1000);
		},
		cookies: {
			"set": function(key, value, endtime) {
		        var key = arguments[0] ? arguments[0] : '';
		        var value = arguments[1] ? arguments[1] : '';
		        var endtime = arguments[2] ? arguments[2] : 60 * 60 * 24 * 15;
		        if (key == '') {
		            return false;
		        }
		        if (key && value == '') {
		            return C.del(key);
		        }
		        if (key && value != '') {
		            var saveobj = {
		                data: value,
		                //time: time(), //保存时间
		                etime: o.time() + endtime
		            }
		            localStorage.setItem(key, JSON.stringify(saveobj));
		            return true;
		        }
		   	},
		    "clear": function() {
		        localStorage.clear();
		    },
		    "del": function(key) {
		        localStorage.removeItem(key);
		    },
		    "get": function(key) {
		        var res = o.json_decode(localStorage.getItem(key));
		        if (!res) {
		            return false;
		        }
		        if (res.etime < o.time()) {
		            localStorage.removeItem(key);
		            return false;
		        }
		        return res.data;
		    },
		    "all": function() {
		        var a = new Array();
		        for (var i = 0; i < localStorage.length; i++) {
		            var key = localStorage.key(i);
		            var res = o.json_decode(localStorage.getItem(localStorage.key(i)));
		            if (res.etime < o.time()) {
		                localStorage.removeItem(key);
		            } else {
		                a[key] = res.data;
		            }
		        }
		        return a;
		    },
		    "gc": function() {
		        var ctime = o.time();
		        for (var i = 0; i < localStorage.length; i++) {
		            var key = localStorage.key(i);
		            var res = o.json_decode(localStorage.getItem(localStorage.key(i)));
		            if (res.etime < o.time()) {
		                localStorage.removeItem(key);
		            }
		        }
		    },
		    "init": function() {
		        var s = arguments[0] ? arguments[0] : 3;
		        s = s * 1000;
		        C.gc();
		        setInterval(function() {
		            C.gc();
		        }, s);
		    }
		},
		active : {
			init:function(id){
				return id||'LAY-user-manage'
			},
			
			batchdel: function(opt) {
				var checkStatus = table.checkStatus(o.active.init(opt.id)),
					checkData = checkStatus.data; //得到选中的数据
				
				if(checkData.length === 0) {
					return layer.msg('请选择数据');
				}

				o.ajax({
					url: opt.url || '',
					data: opt.data || {},
					success:opt.success || function(data){
						table.reload(o.active.init.id);
						layer.msg('已删除');
					}
				})
//				layer.prompt({
//					formType: 1,
//					title: '敏感操作，请验证口令'
//				}, function(value, index) {
//					layer.close(index);
//
//					layer.confirm('确定删除吗？', function(index) {
//
//						//执行 Ajax 后重载
//						/*
//						admin.req({
//						  url: 'xxx'
//						  //,……
//						});
//						*/
//						table.reload('LAY-user-manage');
//						layer.msg('已删除');
//					});
//				});
			},
			add: function(opt) {
				opt.title = opt.title||'窗口';
				opt.url = opt.url||'';
				opt.success = opt.success || function(){};
				opt.area = opt.area || ['500px', '500px']
				layer.open({
					type: 2,
					shade: false,
					area: opt.area,
					maxmin: true,
					title:opt.title,
					content: opt.url,
					btn: ['确定', '取消'],
					zIndex: layer.zIndex, //重点1
					yes: function(index, layero){
			          	//获取iframe元素的值
			         	var othis = layero.find('iframe').contents().find("#formArea");
				      	opt.success(layero,index)
			          	layer.close(index);
			        },
					success: function(layero) {
						layer.setTop(layero); //重点2
					}
				});
			},
			edit: function(opt) {
				opt.title = opt.title||'窗口';
				opt.url = opt.url||'';
				opt.success = opt.success || function(){};
				layer.open({
					type: 2,
					shade: false,
					area: ['500px', '700px'],
					maxmin: true,
					title:opt.title,
					content: opt.url,
					btn: ['确定', '取消'],
					zIndex: layer.zIndex, //重点1
					yes: function(index, layero){
			          	//获取iframe元素的值
			         	var othis = layero.find('iframe').contents().find("#formArea");
				      	opt.success(othis)
			          	layer.close(index);
			        },
					success: function(layero) {
						layer.setTop(layero); //重点2
					}
				});
			}
			
		}
    }
   
    exports('pubilc', {
    	tool:o
    })
})