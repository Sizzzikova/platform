<!--
// Copyright © 2020 Anticrm Platform Contributors.
// 
// Licensed under the Eclipse Public License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License. You may
// obtain a copy of the License at https://www.eclipse.org/legal/epl-2.0
// 
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// 
// See the License for the specific language governing permissions and
// limitations under the License.
-->

<script type="ts">
  import { Ref, Class, Doc, Application, Space, VDoc } from '@anticrm/core'
  import { findOne } from '../../utils'
  import workbench, { WorkbenchApplication } from '../..'
  import { getUIService } from '../../utils'

  import ScrollView from '@anticrm/sparkling-controls/src/ScrollView.svelte'
  import Table from '@anticrm/presentation/src/components/internal/Table.svelte'
  import Icon from '@anticrm/platform-ui/src/components/Icon.svelte'
  import ObjectForm from './ObjectForm.svelte'
  import CreateForm from './CreateForm.svelte'

  export let application: Ref<WorkbenchApplication>
  export let space: Ref<Space>
  // let _id: Ref<VDoc> | undefined

  const uiService = getUIService()

  let addIcon: HTMLElement
  
  let appInstance: WorkbenchApplication | undefined
  $: {
    findOne(workbench.class.WorkbenchApplication, { _id: application }).then(app => { appInstance = app })
    // _id = undefined
  }
</script>

<div class="workbench-browse">
  { #if appInstance }
  <div>
    <span class="caption-1">{appInstance.label}</span>&nbsp;
    <a bind:this={addIcon} href="/"  on:click|preventDefault = { () => { uiService.showModal(CreateForm, { _class: appInstance ? appInstance.classes[0] : undefined, title: 'The title', space }, addIcon) } }>    
      <Icon icon={workbench.icon.Add} clazz="icon-2x"/>
    </a>
  </div>
  <ScrollView stylez="height:100%;">
    <div class="table">
      <Table _class={appInstance.classes[0]} {space} on:open/>
        <!-- <Table _class={appInstance.classes[0]} {space} on:open={ (evt) => { _id = evt.detail._id } }/> -->
    </div>
  </ScrollView>
    <!-- { #if _id}
    <div class="details">
      <ObjectForm _class={appInstance.classes[0]} title="Hello" { _id }/>
    </div>
    { /if } -->
  { /if }
</div>

<style lang="scss">
  .workbench-browse {
    height: 100%;
    display: flex;
    flex-direction: column;
  
    .table {
      margin: 1em;
      flex-grow: 1;
    }

    .details {
      border-top: 1px solid var(--theme-separator-color);
      padding: 1em;
      //max-height: 400px;
    }

  }
</style>