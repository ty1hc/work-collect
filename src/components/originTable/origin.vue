<template>
    <div id="app">
        <h1 style="display: grid;justify-items: center;">调查测量单元</h1>
        <avue-crud
                :option="option"
                :search.sync="search"
                :data="tableData"
                @search-change="searchChange"
                @search-reset="searchReset"
                :page.sync="page"
                @on-load="onLoad">
            <template slot="search">
                <el-form-item label="审批状态" span="24" label-width="200" >
                    <el-row span="24" :gutter="20">
                        <el-checkbox-group v-model="approvalSearch">
                            <el-col v-for="item1 in approvalStatusItem" :key="item1.label" style="float: left" span="au" >
                                <el-checkbox :label="item1.label"  :name="item1.value" style="margin-right: 3px; float: left ;display:flex;"></el-checkbox>
                            </el-col>
                        </el-checkbox-group>
                    </el-row>
                </el-form-item>
            </template>
            <template slot="search">
                <el-form-item label="围填完成情况" span="24"  label-width="200" >
                    <el-row span="24" :gutter="20">
                        <el-checkbox-group v-model="completeSearch">
                            <el-col v-for="item2 in completeStatusItem" :key="item2.label" span="4">
                                <el-checkbox :label="item2.label" :name="item2.value"  style="margin-right: 3px; float: left ;display:flex;"></el-checkbox>
                            </el-col>
                        </el-checkbox-group>
                    </el-row>
                </el-form-item>
            </template>
            <template slot="menu" slot-scope="{row}">
                <a class="customOper" @click="location(row)">定位</a>
            </template>
        </avue-crud>
    </div>
</template>

<script>
    import {getBaseData,getBaseDataMap,baseURL} from '@/components/originTable/newPageApi'
    export default {
        name: "origin",
        data: function() {
            return {
                search: {},
                s1:'',
                s2:'',
                searchParams: [],
                approvalSearch:[],
                completeSearch:[],
                approvalStatusItem:[{label:'未登记备案未发证',value:'未登记备案未发证'},
                    {label:'改变批准用途和用海方式',value:'改变批准用途和用海方式'},
                    {label:'已办理土地收储、转用、征用等手续',value:'已办理土地收储、转用、征用等手续'},
                    {label:'取得海域使用权属证书(含不动产登记证)',value:'取得海域使用权属证书(含不动产登记证)'},
                    {label:'已登记备案未发证(公共用海登记)',value:'已登记备案未发证(公共用海登记)'},
                    {label:'直接颁发土地权属证书',value:'直接颁发土地权属证书'},
                    {label:'已换发土地权属证书',value:'已换发土地权属证书'},
                    {label:'依据水利等部门批准实施的围垦工程或海堤等建设项目',value:'依据水利等部门批准实施的围垦工程或海堤等建设项目'},
                    {label:'已办理土地登记但未发证',value:'已办理土地登记但未发证'},
                    {label:'生态整治修复工程项目',value:'生态整治修复工程项目'}],
                completeStatusItem:[{label:'自然淤积区',value: '自然淤积区'},
                    {label:'部分围填区',value: '部分围填区'},
                    {label:'已填成陆区',value: '已填成陆区'},
                    {label:'围而未填区',value: '围而未填区'},
                    {label:'批而未填区',value: '批而未填区'}],
                page: {
                    pageSize: 10,
                },
                option: { // 表格配置
                    searchMenuSpan:4,
                    searchShow: false,
                    searchBtnText: '查询',
                    index: true,
                    addBtn: false,
                    align: 'center',
                    border: true,
                    indexLabel: '序号',
                    column: [
                        {
                            label: '目录编号',
                            prop: 'catalogNumber',
                            search: true,
                            overHidden: true,
                            searchSpan:5,
                            searchLabelWidth: 100,
                        },
                        {
                            label: '项目名称',
                            prop: 'projectName',
                            search: true,
                            searchSpan:5,
                            searchLabelWidth: 100, overHidden: true,
                            width: 180
                        },
                        {
                            label: '用海主体',
                            prop: 'subject',
                            search: true,
                            searchSpan:5,
                            searchLabelWidth: 100, overHidden: true,
                            width: 190
                        },
                        {
                            label: '所属市县',
                            prop: 'citiesAnCounties',
                            search: false,
                            searchSpan:5,
                            searchLabelWidth: 100,
                            overHidden: true,
                            type: 'select',
                            dicUrl: baseURL + '/yidian/Region/getCities',
                            props: {
                                label: 'name',
                                value: 'name',
                            },
                        },

                        {
                            label: '审批状态',
                            prop: 'approvalStatus',
                        },
                        {
                            label: "设区市",
                            prop: "cityCode",
                            hide: true,
                            showColumn: false,
                            search: true,
                            searchSpan:5,
                            searchLabelWidth: 100,
                            type: 'select',
                            props: {
                                label: 'name',
                                value: 'cityCode'
                            },
                            cascaderItem: ['districtCode'],
                            dicUrl: baseURL + '/yidian/Region/getCities',
                            rules: [{
                                required: true,
                                message: "请输入城市",
                                trigger: "blur"
                            }]
                        },
                        {
                            label: "县（市、区）",
                            prop: "districtCode",
                            hide: true,
                            showColumn: false,
                            searchSpan:5,
                            searchLabelWidth: 100,
                            search: true,
                            type: 'select',
                            props: {
                                label: 'name',
                                value: 'districtCode'
                            },
                            dicUrl: baseURL + '/yidian/Region/getCounty?cityCode={{key}}',

                            rules: [{
                                required: true,
                                message: "请选择区域",
                                trigger: "blur"
                            }]
                        },
                        {
                            label: '围填完成情况',
                            prop: 'completeStatus',
                        },
                        {
                            label: '利用状态',
                            prop: 'useOfState',
                            search: true,
                            searchSpan:5,
                            searchLabelWidth: 100, overHidden: true,
                            type: 'select',
                            dicData:[{label:'已利用',value:'已利用'},{label:'未利用',value:'未利用'}]
                        },
                        {
                            label: '面积（公顷）',
                            prop: 'area',
                            searchLabelWidth: 150, overHidden: true,
                            decimals:4,
                            // formatter: (row,value,label,column) => {
                            //     return label = parseFloat(value).toFixed(4);
                            // }
                        },
                    ]
                },
                tableData: [ // 表格数据

                ],
                tableDataCache: [], // 表格数据缓存
                labelList: [], // 基本信息弹窗input数组

            }
        },
        methods: {
            searchChange (params, done) { // 表格搜索事件
                console.log('searchChange');
                done()
                console.log(params)
                this.searchParams = params
                this.searchParams['complete'] = JSON.stringify(this.completeSearch)
                this.searchParams['approval'] = JSON.stringify(this.approvalSearch)
                getBaseData({ // 请求本底数据
                    current: this.page.currentPage,
                    size: this.page.pageSize,
                    complete:JSON.stringify(this.completeSearch),
                    approval:JSON.stringify(this.approvalSearch),
                    ...params,
                }).then((res) => {
                    this.tableData = res.data.data

                    this.page.total = res.data.totalCount || 0
                }).catch(function (err) {
                    console.log(err);
                })
            },
            searchReset(){
                this.approvalSearch = []
                this.completeSearch = []
            },
            onLoad () {
                console.log('onLoad');
                if (Object.keys(this.searchParams).length > 0) {
                    getBaseData({ // 请求本底数据
                        current: this.page.currentPage,
                        size: this.page.pageSize,
                        complete:JSON.stringify(this.completeSearch),
                        approval:JSON.stringify(this.approvalSearch),
                        ...this.searchParams,
                    }).then((res) => {
                        this.tableData = res.data.data

                        this.page.total = res.data.totalCount || 0
                    }).catch(function (err) {
                        console.log(err);
                    })
                } else {
                    getBaseData({ // 请求本底数据
                        current: this.page.currentPage,
                        size: this.page.pageSize,
                    }).then((res) => {
                        this.tableData = res.data.data

                        this.page.total = res.data.totalCount || 0
                    }).catch(function (err) {
                        console.log(err);
                    })
                }
            },
            location (row) {
                getBaseDataMap({areaId: row.id}).then((res) => {
                    const obj = {
                        id: row.id,
                        data: res.data.data,
                    }
                    sessionStorage.setItem('layers', JSON.stringify(obj))
                    sessionStorage.setItem('url','baseDataTable.html')


                    location.href = 'arcgisMap.html'
                })
            },
        },
        mounted () {
        },
        toThousandFilter(num) {
            return num.toFixed(2)
        }

    }

</script>

<style scoped>

</style>
