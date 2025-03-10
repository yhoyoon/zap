<template>
  <q-page
    padding
    class="row justify-center full-height"
    :class="{ zigbee: getuitheme === 'zigbee' }"
  >
    <Transition name="slide-up" mode="out-in" appear>
      <q-card flat class="q-mt-lg q-rounded-borders-xl bg-glass col-10 column">
        <q-scroll-area class="col q-px-xl">
          <div class="q-py-lg">
            <Transition name="slide-up" mode="out-in" appear>
              <div class="column">
                <img
                  v-if="getuitheme === 'zigbee'"
                  height="40"
                  class="mx-auto q-my-lg block"
                  src="/zigbee_logo.svg"
                />
                <img
                  v-else
                  height="40"
                  class="mx-auto q-my-lg block"
                  src="/matter_logo.svg"
                />
              </div>
            </Transition>
            <div class="row justify-center">
              <q-radio
                v-if="loadPreSessionData.length"
                v-model="customConfig"
                checked-icon="task_alt"
                unchecked-icon="panorama_fish_eye"
                val="select"
                label="Generate New Session"
              />
              <q-radio
                v-if="loadPreSessionData.length"
                v-model="customConfig"
                checked-icon="task_alt"
                class="q-ml-xl"
                unchecked-icon="panorama_fish_eye"
                val="load"
                label="Restore Unsaved Session"
              />
            </div>
            <p
              class="text-center"
              v-if="isMultiplePackage && customConfig === 'select'"
            >
              There are multiple packages of ZCL metadata loaded. Please select
              the one you wish to use with this configuration.
            </p>
            <p class="text-center" v-else-if="customConfig === 'load'">
              These are sessions found in the database that were not saved into
              a .zap file. You can select them here, and continue the work with
              the configuration.
            </p>

            <template v-if="customConfig === 'select'">
              <q-table
                title="Zigbee Cluster Library metadata"
                :rows="zclPropertiesRow"
                :columns="newSessionCol"
                row-key="name"
                :pagination="newGenerationPagination"
                hide-bottom
                flat
                :card-style="{ backgroundColor: 'transparent' }"
              >
                <template v-slot:header="props">
                  <q-tr :props="props">
                    <q-th
                      v-for="col in props.cols"
                      :key="col.name"
                      :props="props"
                    >
                      {{ col.label }}
                    </q-th>
                  </q-tr>
                </template>
                <template v-slot:body="props">
                  <q-tr :props="props" class="table_body">
                    <q-td key="select" :props="props">
                      <q-radio
                        v-model="selectedZclPropertiesData"
                        checked-icon="task_alt"
                        unchecked-icon="panorama_fish_eye"
                        :val="props.row"
                      />
                    </q-td>
                    <q-td key="category" :props="props">
                      <div>{{ props.row.category }}</div>
                    </q-td>
                    <q-td key="description" :props="props">
                      <div>{{ props.row.description }}</div>
                    </q-td>
                    <q-td key="version" :props="props">
                      <div>{{ props.row.version }}</div>
                    </q-td>
                  </q-tr>
                </template>
              </q-table>
              <q-table
                title="Zap Generation Templates"
                :rows="zclGenRow"
                :columns="newSessionCol"
                row-key="name"
                :pagination="newGenerationPagination"
                hide-bottom
                flat
                :card-style="{ backgroundColor: 'transparent' }"
              >
                <template v-slot:top>
                  <div class="q-table__title q-mr-md">
                    Zap Generation Templates
                  </div>
                  <small>( Please select a package for generation )</small>
                </template>
                <template v-slot:header="props">
                  <q-tr :props="props">
                    <q-th
                      v-for="col in props.cols"
                      :key="col.name"
                      :props="props"
                    >
                      {{ col.label }}
                    </q-th>
                  </q-tr>
                </template>
                <template v-slot:body="props">
                  <q-tr :props="props" class="table_body">
                    <q-td key="select" :props="props">
                      <q-checkbox
                        v-model="selectedZclGenData"
                        :val="props.row.id"
                        data-test="gen-template"
                      />
                    </q-td>
                    <q-td key="category" :props="props">
                      <div>{{ props.row.category }}</div>
                    </q-td>
                    <q-td key="description" :props="props">
                      <div>{{ props.row.description }}</div>
                    </q-td>
                    <q-td key="version" :props="props">
                      <div>{{ props.row.version }}</div>
                    </q-td>
                  </q-tr>
                </template>
              </q-table>
            </template>
            <template v-else>
              <q-table
                title=""
                :rows="loadPreSessionData"
                :columns="loadPreSessionCol"
                row-key="name"
                :pagination="pagination"
                flat
                :card-style="{ backgroundColor: 'transparent' }"
              >
                <template v-slot:header="props">
                  <q-tr :props="props">
                    <q-th
                      v-for="col in props.cols"
                      :key="col.name"
                      :props="props"
                    >
                      {{ col.label }}
                    </q-th>
                  </q-tr>
                </template>
                <template v-slot:body="props">
                  <q-tr :props="props" class="table_body">
                    <q-td key="select" :props="props">
                      <q-radio
                        v-model="selectedZclSessionData"
                        checked-icon="task_alt"
                        unchecked-icon="panorama_fish_eye"
                        :val="props.row"
                      />
                    </q-td>
                    <q-td key="zclproperty" :props="props">
                      <div>{{ props.row.zclProperty.description }}</div>
                    </q-td>
                    <q-td key="gen template file" :props="props">
                      <div>{{ props.row.genTemplateFile.version }}</div>
                    </q-td>
                    <q-td key="creation time" :props="props">
                      <div>
                        {{ new Date(props.row.creationTime).toDateString() }}
                      </div>
                    </q-td>
                  </q-tr>
                </template>
              </q-table>
            </template>

            <div class="row justify-center q-mt-xl">
              <q-btn
                :disable="disableSubmitButton"
                :color="disableSubmitButton ? 'blue-grey' : 'primary'"
                @click="submitForm"
                label="Submit"
                data-test="login-submit"
              />
            </div>
          </div>
        </q-scroll-area>
      </q-card>
    </Transition>
  </q-page>
</template>

<script>
import restApi from '../../src-shared/rest-api.js'
import { QSpinnerGears } from 'quasar'
import { setCssVar } from 'quasar'

const generateNewSessionCol = [
  {
    name: 'select',
    label: '',
    align: 'center',
    style: 'width: 25%',
  },
  {
    name: 'category',
    align: 'left',
    label: 'Category',
    style: 'width: 25%',
  },
  {
    name: 'description',
    label: 'Description',
    align: 'left',
    style: 'width: 25%',
  },
  {
    name: 'version',
    label: 'version',
    align: 'left',
    style: 'width: 25%',
  },
]
const loadPreSessionCol = [
  {
    name: 'select',
    label: 'Session',
    align: 'center',
  },
  {
    name: 'zclproperty',
    label: 'ZCL Property',
    align: 'center',
  },
  {
    name: 'gen template file',
    align: 'left',
    label: 'Generation Template File',
  },
  {
    name: 'creation time',
    label: 'Creation Time',
    align: 'left',
  },
]

export default {
  name: 'ZapConfig',
  data() {
    return {
      customConfig: 'select',
      selected: [],
      selectedZclPropertiesData: null,
      selectedZclGenData: [],
      selectedZclSessionData: null,
      zclPropertiesRow: [],
      newSessionCol: generateNewSessionCol,
      loadPreSessionCol: loadPreSessionCol,
      zclGenRow: [],
      newConfig: false,
      path: window.location,
      open: true,
      filePath: '',
      loadPreSessionData: [],
      pagination: {
        rowsPerPage: 10,
      },
      newGenerationPagination: {
        rowsPerPage: 0,
      },
    }
  },
  computed: {
    disableSubmitButton: function () {
      if (this.customConfig === 'select')
        return (
          this.selectedZclPropertiesData == null ||
          this.selectedZclGenData.length == 0
        )
      else return this.selectedZclSessionData == null
    },
    isMultiplePackage: function () {
      return this.zclPropertiesRow.length > 1
    },
    getuitheme: function () {
      return this.selectedZclPropertiesData?.category
    },
  },
  methods: {
    submitForm() {
      if (this.customConfig === 'select') {
        let data = {
          zclProperties: this.selectedZclPropertiesData,
          genTemplate: this.selectedZclGenData,
        }
        this.$router.push({ path: '/' })
        this.$q.loading.show({
          spinner: QSpinnerGears,
          messageColor: 'white',
          message: 'Please wait while zap is loading...',
          spinnerSize: 300,
        })

        if (this.open) {
          this.$serverPost(restApi.uri.sessionCreate, data)
            .then(() => this.$serverPost(restApi.ide.open, this.path))
            .then(() => {
              this.$store.commit('zap/selectZapConfig', {
                zclProperties: this.selectedZclPropertiesData,
                genTemplate: this.selectedZclGenData,
                newConfig: false,
              })
            })
        } else {
          this.$serverPost(restApi.uri.sessionCreate, data).then(() => {
            this.$store.commit('zap/selectZapConfig', {
              zclProperties: this.selectedZclPropertiesData,
              genTemplate: this.selectedZclGenData,
              newConfig: true,
            })
          })
        }
      } else {
        this.$serverPost(restApi.uri.reloadSession, {
          sessionId: this.selectedZclSessionData.id,
        }).then((result) => {
          this.$store.commit('zap/selectZapConfig', {
            sessionId: this.selectedZclSessionData.id,
            zclProperties: this.selectedZclSessionData.zclProperty,
          })
        })
      }
    },
  },
  created() {
    this.$serverPost(restApi.uri.sessionAttempt, this.path).then((result) => {
      this.zclPropertiesRow = result.data.zclProperties
      this.selectedZclPropertiesData = result.data.zclProperties[0]
      this.zclGenRow = result.data.zclGenTemplates
      this.filePath = result.data.filePath
      this.open = result.data.open
      if (this.zclPropertiesRow.length == 1 && this.zclGenRow.length == 1) {
        // We shortcut this page, if there is exactly one of each,
        // since we simply assume that they are selected and move on.
        this.selectedZclGenData[0] = this.zclGenRow[0].path
        this.customConfig = 'select'
        this.submitForm()
      } else {
        this.customConfig = 'select'
      }

      result.data.sessions.forEach((item) => {
        let atts = null
        let gen = null
        item.packageRef.forEach((element) => {
          !atts
            ? (atts = this.zclPropertiesRow.find((data) => data.id === element))
            : ''
          !gen ? (gen = this.zclGenRow.find((data) => data.id === element)) : ''
        })
        this.loadPreSessionData.push({
          zclProperty: atts,
          genTemplateFile: gen,
          creationTime: item.creationTime,
          id: item.sessionId,
        })
      })
      this.selectedZclSessionData = this.loadPreSessionData[0]
    })
  },
}
</script>
<style lang="scss" scoped>
.q-page {
  background: url('/bg-matter.jpg');
  // background: @image, -moz-linear-gradient(top, @startColor, @endColor); // FF 3.6+
  //     background: @image, -webkit-gradient(linear, 0 0, 0 100%, from(@startColor), to(@endColor)); // Safari 4+, Chrome 2+
  //     background: @image, -webkit-linear-gradient(top, @startColor, @endColor); // Safari 5.1+, Chrome 10+
  //     background: @image, -o-linear-gradient(top, @startColor, @endColor); // Opera 11.10
  //     background: @image, linear-gradient(to bottom, @startColor, @endColor); // Standard, IE10
  //background-attachment: fixed;
  background-size: cover;
  transition: 2s;

  &.zigbee {
    background: url('/bg-zigbee.jpg');
    //  background-attachment: fixed;
    background-size: cover;
    transition: 2s;
  }
}
.slide-up-enter-active,
.slide-up-leave-active {
  transition: all 0.55s ease-out;
}

.slide-up-enter-from {
  opacity: 0;
  transform: translateY(30px);
}

.slide-up-leave-to {
  opacity: 0;
  transform: translateY(-30px);
}
</style>
