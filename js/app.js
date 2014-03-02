/**
 * Created by 月飞 on 14-1-25.
 */
(function(){
    var myApp=angular.module('myApp',[]);
    myApp.controller('customFieldsListCtrl',['$scope','$http','$rootScope',function($scope,$http,$rootScope){
        $scope.fields=[];
        $scope.data=[];
        $http.get('fieldsPackage.json').success(function(data){
            if(data&&data.modules){
                $scope.data=data.modules;
                $rootScope.allValid=data.valid;
            }
        });
        $scope.showFieldsKeys=function($index){
            $scope.selectIndex=$index;
            $scope.fields=this.item.fields;
            $rootScope.fieldsStrs=[];
            $rootScope.fieldsList=[];
            angular.forEach($scope.fields,function(value,key){
                if(value.checked){
                    $rootScope.fieldsStrs.push(value.code+':'+value.name+':'+value.type);
                    $rootScope.fieldsList.push(value);
                }
            });
        };
        $scope.checkField=function(checked){
            var item=this.sub,tmpArr=[],tmpStr=[];
            if(checked){
                item.checked=false;
                angular.forEach($rootScope.fieldsList,function(value,key){
                    if(value.checked){
                        tmpStr.push(value.code+':'+value.name+':'+value.type);
                        tmpArr.push(value)
                    }
                });
                $rootScope.fieldsStrs=tmpStr;
                $rootScope.fieldsList=tmpArr;
            }else{
                this.sub.checked=true;
                $rootScope.fieldsStrs.push(item.code+':'+item.name+':'+item.type);
                $rootScope.fieldsList.push(item);
            }
        }
    }]);
    myApp.controller('fieldsValidCtrl',['$scope','$rootScope',function($scope,$rootScope){
        var strReg='maxLength,minLength',
            imgReg='linkUrlPsd,linkUrlPreview,imgWidth,imgHeight',
            strValid=[],
            imgValid=[];
        $scope.currentValidList=[];
        $scope.fieldsChange=function(field){
            if(!strValid.length&&!strValid.length){
                angular.forEach($rootScope.allValid,function(val,key){
                    if(strReg.indexOf(val.code)>-1){
                        strValid.push(val);
                    }else if(imgReg.indexOf(val.code)>-1){
                        imgValid.push(val);
                    }
                });
            }
            switch (field.type){
                case 'string':
                    $scope.validList=strValid;
                    break;
                case 'img':
                    $scope.validList=imgValid;
                    break;
                case 'href':
                    $scope.validList=[];
                    break;
            }
        };
        $scope.addValid=function(field,valid,val){
            var isIn=-1;
            if(field&&valid&&val){
                angular.forEach($scope.currentValidList,function(val,key){
                    if(val.field.code===field.code&&val.valid.code===valid.code){
                        isIn=key;
                    }
                });
                if(isIn>-1){
                    $scope.currentValidList[isIn].val=val;
                }else{
                    $scope.currentValidList.push({field:field,valid:valid,val:val});
                }
                $rootScope.ValidStr=strForValid($scope.currentValidList);
            }
        };
        $scope.delValid=function(id){
            var tmpArr=[];
            angular.forEach($scope.currentValidList,function(val,key){
                if(key!==id){
                    this.push(val);
                }
            },tmpArr);
            $scope.currentValidList=tmpArr;
            $rootScope.ValidStr=strForValid($scope.currentValidList);
        }
    }]);
    myApp.controller('tabCtrl',['$scope',function($scope){
        $scope.currentIndex=0;
        $scope.tabs=[{'name':'字段设置','href':'#/tab1'}];
        $scope.tabClick=function($index){
            $scope.currentIndex=$index;
        }
    }]);
    function strForValid(list){
        var validObj={};
        angular.forEach(list,function(val,key){
            if(validObj[val.field.code]){
                validObj[val.field.code]+=','+val.valid.code+':'+val.val;
            }else{
                validObj[val.field.code]=val.valid.code+':'+val.val;
            }
        });
        return validObj;
    }
})();