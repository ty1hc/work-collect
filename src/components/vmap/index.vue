<template>
  <div>
    <div class="bm-view">
      <div class="top-switch">
        <div class="top-switch-right">
          <el-radio-group v-model="mapControl" @change="controlSwitch">
            <el-radio-button label="1">
              <i class="iconfont iconicon-biology"></i>
              动植物分布
            </el-radio-button>
            <el-radio-button label="2">
              <i class="iconfont iconicon-wetland"></i>
              湿地分布
            </el-radio-button>
          </el-radio-group>
        </div>
      </div>
      <el-amap vid="amap" :zoom="zoom" :zooms="zooms" :plugin="plugins" :center="center" :events="mapEvents"
               mapStyle="fresh"
               viewMode="3D" pitch="50"
               :amap-manager="amapManager">
        <!--点信息-->
        <el-amap-marker v-for="(marker, index) in markers" :key="marker[0]" :position="marker.position"
                        :vid="marker.index" :content-render="marker.contentRender" :events="marker.events"
                        :offset="marker.offset"></el-amap-marker>
      </el-amap>
      <div v-show="mapNavLeft">
        <div class="map_menu">
          <ul>
            <li><a href="http://223.4.74.162:8001/#/" target="_blank">
              <img src="/img/map/menu_wuzhong.png" alt="">
              <span>首页</span></a>
            </li>
            <li><a href="http://223.4.74.162:8001/#/WetlandsInfo" target="_blank">
              <img src="/img/map/menu_lvyou.png" alt="">
              <span>湿地资源介绍</span></a>
            </li>
            <li><a href="http://223.4.74.162:8001/#/AnimalsAPlantsInfo" target="_blank">
              <img src="/img/map/menu_kepu.png" alt="">
              <span>野生动植物介绍</span></a>
            </li>
            <li><a href="http://223.4.74.162:8001/#/Guide" target="_blank">
              <img src="/img/map/menu_vr.png" alt="">
              <span>许可指南</span></a>
            </li>
            <li><a href="http://223.4.74.162:8001/#/Rescue" target="_blank">
              <img src="/img/map/menu_sheying.png" alt="">
              <span>野生动物救护点</span></a>
            </li>

            <li><a href="http://223.4.74.162:8001/#/Notice" target="_blank">
              <img src="/img/map/menu_menpiao.png" alt="">
              <span>文件与公告</span></a>
            </li>
            <li><a href="http://223.4.74.162:8001/#/PopScience" target="_blank">
              <img src="/img/map/menu_hudong.png" alt="">
              <span>科普宣教</span></a>
            </li>
          </ul>
        </div>
        <div class="map_title"><img src="/img/map/map_title.png" alt=""></div>
      </div>
      <div class="weslandDetail" v-if="showWeslandDetail">
        <div class="weslandName">{{detailWelend.cname}}</div>
        <div class="weslandTitle">湿地简介
          <div class="weslandBtn">
            <el-tag type="primary" v-if="detailWelend.detailUrl" @click="goTo(detailWelend.detailUrl)">预览</el-tag>
            <el-tag type="success" v-if="detailWelend.appUrl" @click="goTo(detailWelend.appUrl)">更多</el-tag>
          </div>
        </div>
        <div class="weslandDetailInfo">{{detailWelend.desc}}</div>
        <div class="weslandTitle">近10年湿地面积趋势图</div>
        <ChartDataLine ref="chartDataLine" :xAxisData="detailWelend.xAxisData" :seriesData="detailWelend.seriesData"/>
      </div>
      <div v-if="showWeslandTotal" class="weslandTotal">
        <div class="weslandTitle">数据列表</div>
        <div class="weslandTotalTable">
          <div class="weslandTotalTableTop">
            <table width="100%" class="" cellspacing="0" cellpadding="0">
              <tr>
                <td>序号</td>
                <td>湿地名称</td>
                <td>所在城市</td>
                <td>类型</td>
                <td>面积(hm²)</td>
              </tr>
            </table>
          </div>
          <div class="weslandTotalBody">
            <table width="100%" cellspacing="0" cellpadding="0">
              <tr v-for="(item,index) in totalTableData" :key="index">
                <td>{{item.index}}</td>
                <td>{{item.cname}}</td>
                <td>{{item.city}}</td>
                <td>{{item.type}}</td>
                <td>{{item.area}}</td>
              </tr>
            </table>
          </div>
        </div>
        <div class="weslandTitle">近10年各类型湿地统计</div>
        <div class="map_pie">
          <el-tabs type="border-card">
            <el-tab-pane>
              <span slot="label"><i class="el-icon-s-data"></i> 占地面积趋势统计</span>
              <ChartDataBar :xAxisData="totalChartBar.xAxisData" :seriesData="totalChartBar.seriesData"
                            :chartColor="chartColor"/>
            </el-tab-pane>
            <el-tab-pane>
              <span slot="label"><i class="el-icon-s-help"></i> 占地面积占比分析</span>
              <ChartDataPie :seriesData="totalChartPie.seriesData" :chartColor="chartColor"/>
            </el-tab-pane>
          </el-tabs>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import {AMapManager} from 'vue-amap'
  import zhejiangGeoJson from './coods.json'
  import biologyJson from './biology.json'
  import wetlandJson from './wetland.json'
  import wetlandDataJson from './wetlandData.json'
  import ChartDataPie from '@/components/map-chart/pie'
  import ChartDataBar from '@/components/map-chart/bar'
  import ChartDataLine from '@/components/map-chart/line'

  let amapManager = new AMapManager()
  import {lazyAMapApiLoaderInstance} from 'vue-amap'

  var satelliteLayer = new AMap.TileLayer.Satellite();
  //动植物、湿地保护
  const [BIOLOGY, WETLANDS] = ["1", "2"]
  /* 数据源类型 */
  // 路段数据、人员数据
  export default {
    data() {
      return {
        mapNavLeft: true,
        mapEvents: {
          complete: () => {
            this.drawLineForProvince()
            this.drawAreaProvince()
            this.setSatelliteLayer()
          }
        },
        mapControl: BIOLOGY,
        detailWidth: '100vw',
        zoom: 8,
        zooms: [8, 10],
        center: [120.241566, 29.289648],
        amapManager,
        showWeslandDetail: false,
        showWeslandTotal: false,
        searchOption: {},
        alligatorDetailVisible: false,
        markers: [],
        markPoints: biologyJson,
        plugins: [
          {
            pName: 'Scale'
          },
          {
            pName: 'OverView'
          }
        ],
        totalTableData: [],
        chartColor: ['#3da3d8', '#de65ad', '#fed968', '#fd9f82', '#6cdfe2'],
        totalChartBar: {
          legendData: [],
          xAxisData: [],
          seriesData: []
        },
        totalChartPie: {
          seriesData: []
        },
        detailWelend: {
          cname: '',
          desc: '',
          detailUrl: '',
          appUrl: '',
          xAxisData: [],
          seriesData: []
        }
      }
    },
    components: {
      ChartDataPie, ChartDataBar, ChartDataLine
    },
    mounted() {
      //解决页面刷新后，地图组件会报错
      lazyAMapApiLoaderInstance.load().then(() => {
        localStorage.removeItem('_AMap_raster');
      })
    },
    methods: {
      setSatelliteLayer() {
        let map = amapManager.getMap()
        satelliteLayer.setMap(map)
        this.controlSwitch()
      },
      initPoint() {
        this.markPoints.forEach((marker) => {
          let type = this.mapControl;
          if (BIOLOGY == type) {
            marker.contentRender = h => {
              return h('div', {
                  'class': 'img-animal',
                },
                [
                  h('img', {
                    attrs: {
                      src: marker.picture,
                      style: `width:${marker.width}px;height:${marker.height}px`
                    }
                  }),
                  h('div', {
                      'class': 'info-window',
                    },
                    [
                      h('div', {
                          'class': 'info-window-content'
                        },
                        [
                          h('h4', marker.cname),
                          h('h5', marker.ename),
                          h('p', marker.desc),
                          h('el-tooltip', {
                              props: {
                                disabled: marker.isDetail,
                                content: '暂未接入',
                                placement: 'right'
                              }
                            },
                            [
                              h('span', {}, [
                                h('el-button', {
                                  props: {
                                    disabled: !marker.isDetail,
                                  },
                                  domProps: {
                                    innerHTML: '总览'
                                  },
                                  on: {
                                    click: () => window.open(marker.detailUrl, 'blank')
                                  },
                                }),
                              ])
                            ]),
                          h('el-tooltip', {
                              props: {
                                disabled: marker.isDetail,
                                content: '暂未接入',
                                placement: 'right'
                              }
                            },
                            [
                              h('span', {}, [
                                h('el-button', {
                                  props: {
                                    disabled: !marker.appUrl,
                                  },
                                  style: {
                                    marginLeft: '20px'
                                  },
                                  domProps: {
                                    innerHTML: '详情'
                                  },
                                  on: {
                                    click: () => window.open(marker.appUrl, 'blank')
                                  },
                                }),
                              ])
                            ])
                        ])
                    ])
                ])
            }
          } else {
            marker.contentRender = h => {
              return h('div', {
                  'class': 'img-animal',
                },
                [
                  h('img', {
                    attrs: {
                      src: marker.picture,
                      style: `width:${marker.width}px;height:${marker.height}px`
                    }
                  })
                ])
            }
          }
          marker.offset = [-65, -130]
          /* 地图点增加点击事件 */
          marker.events = {
            click: () => {
              this.detailInfo(marker)
            }
          }
          this.markers.push(marker)
        })
      },
      drawAreaProvince() {
        var map = amapManager.getMap()
        var geojson = new AMap.GeoJSON({
          geoJSON: zhejiangGeoJson,
          getPolygon: function (geojson, lnglats) {
            return new AMap.Polygon({
              path: lnglats,
              fillOpacity: 0.64,
              strokeColor: 'white',
              fillColor: '#999999'
            });
          }
        });
        geojson.setMap(map);
      },
      drawLineForProvince() {
        var opts = {
          subdistrict: 0,
          extensions: 'all',
          level: 'province'
        }
        // 利用行政区查询获取边界构建mask路径
        // 也可以直接通过经纬度构建mask路径
        var district = new AMap.DistrictSearch(opts)
        district.search('浙江省', function (status, result) {
          var bounds = result.districtList[0].boundaries
          var mask = []
          for (var i = 0; i < bounds.length; i += 1) {
            mask.push([bounds[i]])
          }
          var map = amapManager.getMap()
          for (var i = 0; i < bounds.length; i += 1) {
            new AMap.Polyline({
              path: bounds[i],
              strokeColor: '#f9ca1b',
              strokeWeight: 4,
              map: map
            })
          }
        })

      },
      detailInfo(marker) {
        let type = this.mapControl;
        if (type == WETLANDS) {
          // this.showWeslandTotal = false
          this.showWeslandDetail = true
          this.detailWelend.cname = marker.cname
          this.detailWelend.desc = marker.desc
          this.detailWelend.detailUrl = marker.detailUrl
          this.detailWelend.appUrl = marker.appUrl
          this.detailWelend.xAxisData = wetlandDataJson.totalChartBar.xAxisData
          console.log(marker.area)
          this.detailWelend.seriesData = this.randomWetlandTrend(marker.area)
        }
      },
      /**
       * 生成随机湿地趋势
       */
      randomWetlandTrend(area) {
        let wetlandTrend = [];
        let startArea = area - (area * 0.1);
        let temp = area - startArea;
        for (let i = 0; i < 10; i++) {
          startArea += temp * 0.1
          wetlandTrend.push(Math.round(startArea*100)/100)
        }
        return wetlandTrend
      },
      goTo(url) {
        window.open(url, 'blank')
      },
      /**
       * 控件图标切换
       */
      controlSwitch() {
        let type = this.mapControl;
        this.markers = [];
        switch (type) {
          case BIOLOGY:
            satelliteLayer.show()
            this.mapNavLeft = true
            this.showWeslandTotal = false
            this.showWeslandDetail = false
            this.markPoints = biologyJson
            this.initPoint()
            break
          case WETLANDS:
            satelliteLayer.hide()
            this.mapNavLeft = false
            this.showWeslandTotal = true
            this.showWeslandDetail = false
            this.markPoints = wetlandJson
            this.totalTableData = wetlandJson
            this.totalChartBar.legendData = wetlandDataJson.totalChartBar.legendData
            this.totalChartBar.xAxisData = wetlandDataJson.totalChartBar.xAxisData
            this.totalChartBar.seriesData = wetlandDataJson.totalChartBar.seriesData
            this.totalChartPie.seriesData = wetlandDataJson.totalChartPie.seriesData
            this.initPoint()
            break
        }
      }
    }
  }
</script>

<style lang="less">
  .bm-view {
    width: 100%;
    height: 100%;
    z-index: 1000;
    margin: auto;
    position: absolute;
    top: 0;
    left: 0;
    bottom: 0;
    right: 0;
    padding: 0;
  }

  .weslandDetail {
    position: absolute;
    left: 15px;
    top: 80px;
    width: 500px;
    background: #fff;
    box-shadow: 0 0 5px 5px rgba(0, 0, 0, .1);
    padding: 10px 15px 0;

    .weslandDetailInfo {
      font-size: 14px;
      color: #666;
      line-height: 1.5;
      text-indent: 28px;
      margin: 10px 0;
    }
  }

  .weslandTitle {
    font-size: 16px;
    color: #2ba6a6;
    line-height: 32px;
    height: 32px;
    font-weight: bold;
    position: relative;
    padding-left: 10px;

    &:before {
      content: '';
      position: absolute;
      left: 0;
      top: 8px;
      width: 3px;
      height: 16px;
      background: #2ba6a6;
      border-radius: 3px;
    }

    .weslandBtn {
      position: absolute;
      right: 10px;
      top: 0;

      .el-tag {
        padding-left: 15px;
        padding-right: 15px;
        font-size: 13px;
        cursor: pointer;
        line-height: 34px;
        height: 36px;

        &:nth-child(2) {
          margin-left: 10px;
        }
      }
    }
  }

  .weslandTotal {
    position: absolute;
    right: 15px;
    top: 80px;
    width: 500px;
    font-size: 14px;
    background: #fff;
    box-shadow: 0 0 5px 5px rgba(0, 0, 0, .1);
    padding: 5px 15px;

    .weslandTotalTable {
      margin-bottom: 15px;

      table {
        border: 1px solid #ebeef5;
        font-size: 13px;

        td {
          line-height: 16px;
          height: 16px;
          border-right: 1px solid #ebeef5;
          padding: 6px 5px;
          text-align: center;

          &:nth-child(1) {
            width: 40px;
          }

          &:nth-child(2) {
            text-align: left;
            width: 210px;
          }

          &:nth-child(3) {
            width: 72px;
          }

          &:nth-child(4) {
            width: 72px;
          }

          &:last-child {
            border-right: none;
          }
        }
      }

      .weslandTotalTableTop table {
        td {
          background: #f5f7fa;
          padding: 8px 5px;
          font-weight: bold;
        }
      }

      .weslandTotalBody {
        overflow-y: scroll;
        height: 29vh;
        border-bottom: 1px solid #ebeef5;

        table {
          border-bottom: none;
          overflow-y: scroll;
          height: 250px;
          background: #fff;
          border-top: none;

          td {
            border-bottom: 1px solid #ebeef5;
          }

          tr:last-child td {
            border-bottom: none;
          }
        }
      }
    }

    .map_pie {
      width: 100%;
      margin-bottom: 10px;

      .el-tabs--border-card {
        box-shadow: none;
      }
    }
  }


  @keyframes info-fade-in {
    0% {
      opacity: 0;
    }
    40% {
      opacity: 0;
    }
    100% {
      opacity: 1;
    }
  }

  .img-animal {
    img {
      position: absolute;
    }

    &:hover .info-window {
      display: block;
      animation: info-fade-in;
      animation-duration: 1s;
    }
  }

  .info-window {
    width: 850px;
    height: 336px;
    position: absolute;
    background: url('/img/map/map_on.png');
    top: -90px;
    left: -60px;
    display: none;

    &-content {
      padding-left: 420px;
      color: #fff;
      margin-right: 20px;

      h4 {
        padding: 40px 0 0;
        font-size: 28px;
      }

      h5 {
        padding: 5px 0 10px;
        font-size: 20px;
        font-weight: 300;
        letter-spacing: .08rem;
        border-bottom: 2px solid #1a9be6;
      }

      p {
        padding: 15px 0 15px;
        line-height: 24px;
        font-size: 18px;
        color: white;
      }

      span:last-child button {
        background-color: #e6a23c;
        border-color: #e6a23c;
      }

      button {
        margin-left: 0 !important;
        margin-right: 15px;
        font-size: 16px;
        color: #fff;
        background-color: #409eff;
        border-color: #409eff;
      }
    }
  }

  .value_env .el-form-item__label {
    color: #fff !important;
  }

  .amap-maptypecontrol {
    z-index: 100;
  }

  .amap-logo {
    display: none !important;
  }

  .amap-copyright {
    display: none !important;
  }

  .text-red {
    color: #dc3545;
  }

  .text-green {
    color: #28a745;
  }

  .map_title {
    z-index: 200;
    position: absolute;
    top: 50%;
    margin-top: -325px;
    left: 20px;
    width: 40px;

    img {
      width: 100%;
    }
  }

  .map_menu {
    ul, li {
      margin: 0;
      padding: 0;
      list-style: none;
    }
  }

  .map_menu {
    z-index: 200;
    position: absolute;
    top: 55%;
    right: 10px;
    background: rgba(0, 0, 60, .3);
    border-radius: 2px;
    width: 70px;
    padding: 15px;
    margin-top: -365px;
  }

  .map_menu li a {
    position: relative;
    display: block;
    height: 70px;
    padding: 15px 10px;
  }

  .map_menu li a img {
    width: 90%;
    transition: all .5s;
    margin: 0 5%;
  }

  .map_menu li a span {
    background: rgba(0, 0, 60, .7);
    color: #fff;
    box-shadow: inset 2px 2px 2px rgba(0, 0, 60, .3);
    padding: 5px 8px;
    border-radius: 2px;
    position: absolute;
    left: -100px;
    top: 40px;
    width: 90px;
    text-align: center;
    display: none;
  }

  .map_menu li a:hover img {
    transform: scale(1.35);
    margin-left: 1%;
  }

  .map_menu li a:hover span {
    display: inline-block;
  }

  .map_box {
    z-index: 200;
    background: rgba(0, 0, 60, .7);
    border-radius: 6px;
    padding: 15px;
    color: #fff;
    position: absolute;
    top: 30px;
    left: 30px;
    width: 350px;
    min-height: 200px;
  }

  .map_box h3 {
    border-bottom: 2px solid #864DD9;
    font-size: 1.25rem;
    margin-bottom: 1rem;
    line-height: 2;
  }

  .map_box p {
    padding-left: 25px;
    position: relative;
  }

  .map_box p::before {
    content: '1';
    position: absolute;
    left: 0;
    top: 0;
    background: #e95f71;
    border-radius: 50%;
    color: #fff;
    width: 18px;
    line-height: 18px;
    height: 18px;
    text-align: center;
  }

  .map_box_shebei {
    top: 300px;
  }

  .map_box i, .map_box em, .map_box b, .map_box s {
    font-style: normal;
    text-decoration: none;
  }

  .map_box_shebei {
    padding-bottom: 25px;
    padding-top: 5px;
  }

  .map_box_shebei span {
    line-height: 1.2;
    display: inline-block;
    width: 150px;
    text-align: center;
    letter-spacing: 1px;
  }

  .map_box_shebei span:first-child, .map_box_shebei span:nth-child(2) {
    padding-bottom: .8rem;
  }

  .map_box_shebei span i {
    font-size: 1.5rem;
    line-height: 2;
    color: #CF53F9;
  }

  .map_box_shebei span em {
    font-weight: 300;
    font-size: 1rem;
    padding-left: .15rem;
  }

  .map_box_wenshidu {
    top: auto;
    bottom: 30px;
    min-height: 150px;
  }

  .map_box_wenshidu span {
    line-height: 2;
    display: inline-block;
    width: 150px;
  }

  .map_box_wenshidu b {
    font-size: 1.05rem;
    font-weight: 700;
  }

  .map_box_wenshidu s {
    padding-left: .5rem;
  }

  .top-switch {
    z-index: 10;
    position: fixed !important;
    margin-top: 5px;
    padding: 14px 0 13px;
    background: rgba(0, 0, 60, .8);
    border-radius: 3px;
    box-shadow: 0 0 5px rgba(0, 0, 0, .12);

    &-right {
      position: fixed !important;
      right: 15px;
      display: inline;
    }
  }

  /*地图类型切换组件隐藏*/
  .amap-controls {
    display: none;
  }

  .info-window-content {
    h4, h5, p {
      margin: 0px;
    }

    h4 {
      margin-top: -15px;
    }

    h5 {
      font-size: 16px;
    }
  }

</style>
