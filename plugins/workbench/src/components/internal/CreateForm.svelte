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

<script lang="ts">
  import { Ref, Class, Doc, generateId, Space, VDoc } from '@anticrm/core'
  import { createEventDispatcher } from 'svelte'
  import { AnyComponent } from '@anticrm/platform-ui'
  import presentation from '@anticrm/presentation'
  import { getComponentExtension, getCoreService } from '../../utils'

  import Component from '@anticrm/platform-ui/src/components/Component.svelte'

  export let title: string
  export let _class: Ref<Class<Doc>>
  export let space: Ref<Space>
  let object = {}

  let component: AnyComponent
  $: getComponentExtension(_class, presentation.class.DetailForm).then(ext => { component = ext })

  const coreService = getCoreService()
  const dispatch = createEventDispatcher()

  function save() {
    coreService.then(coreService => {
      const doc = { _class, _space: space, ...object }
      object = {}
      // absent VDoc fields will be autofilled
      coreService.createVDoc(doc as unknown as VDoc)
    })
    dispatch('close')
  }
</script>

<div class="recruiting-view">
  <div class="header">
    <div class="caption-4">{title} : {space}</div>
    <div class="actions">
      <button class="button" on:click={ () => { dispatch('close') } }>Cancel</button>
      <button class="button" on:click={save}>Save</button>
    </div>
  </div>

  <div class="content">
    <Component is={component} props={{ _class, object  }} />
  </div>
</div>

<style lang="scss">  
  .recruiting-view {
    margin: 1em;
  }
  .header {
    display: flex;

    .actions {
      display: flex;
      flex-grow: 1;
      flex-direction: row-reverse;
      font-size: 10px;

      button {
        margin-left: 0.5em;
      }
    }
  }

  .content {
  }

  .attributes {
    display: flex;
    flex-wrap: wrap;

    //display: grid;
    //background-color: $content-color-dark;
    //grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
    //grid-gap: 1px;

    margin-top: 1em;

    .group {
      padding: 0.5em;
      //background-color: $content-bg-color;
    }
  }
</style>