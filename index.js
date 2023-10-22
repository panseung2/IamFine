let dataList = []
let tmpDataList = []

// 1. 그래프
const barChart = document.querySelector('.graph-bar-chart')
const numberChart = document.querySelector('.graph-number-chart')
// 2. 값 편집
const applyButton = document.querySelector('.apply-button')
const dataTableBody = document.querySelector('.edit-tbody')
// 3. 값 추가
const addIdInput = document.querySelector('.add-id-input')
const addValueInput = document.querySelector('.add-value-input')
const addButton = document.querySelector('.add-button')
// 4. 값 고급 편집
const editTextbox = document.querySelector('.edit-textbox')
const editButton = document.querySelector('.edit-button')


// 값 추가 로직
addButton.addEventListener('click', function () {
  const id = addIdInput.value
  const value = addValueInput.value

  if (!id) {
    alert('ID를 입력해주세요.')
  } else if (!/^\d+$/.test(id)) {
    addIdInput.value = ''
    alert('ID는 0이상의 정수만 입력해주세요.')
  } else if (isDuplicateID(id)) {
    addIdInput.value = ''
    alert('이미 존재하는 ID입니다.')
  } else if (!value) {
    alert('Value를 입력해주세요.')
  } else if (!/^\d+$/.test(value) || value < 0 || value > 100) {
    addValueInput.value = ''
    alert('Value는 0과 100 사이의 정수만 입력해주세요.')
  } else {
    const data = {
      id: id,
      value: value
    }
    dataList.push(data)
    addIdInput.value = ''
    addValueInput.value = ''

    sortDataList()
    renderAdvancedEdit()
    renderTable()
    renderChart()
  }
})

// id 중복 검사 함수
function isDuplicateID(id) {
  return dataList.some(item => item.id === id)
}

// 값 편집 렌더링
function renderTable() {
  dataTableBody.innerHTML = ''
  sortDataList()
  
  tmpDataList = JSON.parse(JSON.stringify(dataList))
  tmpDataList.forEach((item, i) => {
    const newRow = document.createElement('tr')
    newRow.classList.add('data-row')
    newRow.innerHTML = `
      <td class='data-td'>${item.id}</td>
      <td class='data-td clickable'>
        <div class="value-div">${item.value}</div>
        <input type="text" class="hidden edit-input" value="${item.value}">
      </td>
      <td class='data-td'><button class="delete-button" data-index="${i}">삭제</button></td>
    `

    // 삭제 버튼 클릭 이벤트
    const deleteButton = newRow.querySelector('.delete-button')
    deleteButton.addEventListener('click', function () {
      const confirmDelete = confirm('정말 삭제하시겠습니까?')
      if (confirmDelete) {
        const rowIndex = deleteButton.getAttribute('data-index')
        dataList.splice(rowIndex, 1)
        renderAdvancedEdit()
        renderTable()
        renderChart()
      }
    })

    // 값 편집 부분에서 value만 클릭하여 수정하는 이벤트
    const valueDiv = newRow.querySelector('.value-div')
    const editInput = newRow.querySelector('.edit-input')

    valueDiv.addEventListener('click', function () {
      valueDiv.classList.add('hidden')
      editInput.classList.remove('hidden')
      editInput.focus()
    })

    editInput.addEventListener('blur', function () {
      valueDiv.textContent = editInput.value
      item.value = editInput.value
      valueDiv.classList.remove('hidden')
      editInput.classList.add('hidden')
    })

    dataTableBody.appendChild(newRow)
  })
}

// 데이터 id기준으로 정렬
function sortDataList() {
  dataList.sort((a, b) => a.id - b.id)
}

// 편집 apply 버튼 클릭 이벤트
applyButton.addEventListener('click', function() {
  const applyConfirm = confirm('Data를 수정하시겠습니까?')

  if (applyConfirm) {
    for (const item of tmpDataList) {
      if (!item.value) {
        alert('Value를 입력해주세요.')
        return
      }
  
      if (!/^\d+$/.test(item.value) || item.value < 0 || item.value > 100) {
        alert('Value는 0과 100 사이의 정수만 입력해주세요.')
        return
      }
    }

    tmpDataList = JSON.parse(JSON.stringify(dataList))
    renderAdvancedEdit()
    renderTable()
    renderChart()
  }
})

// 고급 apply 버튼 클릭 이벤트
editButton.addEventListener('click', function () {
  const editedData = editTextbox.value

  let newDataList

  // JSON형식 검사
  try {
    newDataList = JSON.parse(editedData)
  } catch (error) {
    alert('Data 형식이 올바르지 않습니다.')
    return
  }

  // 배열 형식 검사
  if (!Array.isArray(newDataList)) {
    alert('Data 형식이 올바르지 않습니다.')
    return
  }

  // id 및 value값 검사
  for (const item of newDataList) {
    if (!item.id) {
      alert('ID를 입력해주세요.')
      return
    }
    
    if (!/^\d+$/.test(item.id)) {
      alert('ID는 0이상의 정수만 입력해주세요.')
      return
    }

    if (!item.value) {
      alert('Value를 입력해주세요.')
      return
    }

    if (!/^\d+$/.test(item.value) || item.value < 0 || item.value > 100) {
      alert('Value는 0과 100 사이의 정수만 입력해주세요.')
      return
    }
  }

  // id중복 검사
  if (hasDuplicateIDs(newDataList)) {
    alert('중복된 ID가 존재합니다. 수정이 불가능합니다.')
    return
  }

  // 사용자 확인창 로직
  const confirmation = confirm('Data를 수정하시겠습니까?')

  if (confirmation) {
    dataList = newDataList
    sortDataList()
    renderTable()
    renderAdvancedEdit()
    renderChart()
    return
  }
})

// ID 중복체크 함수
function hasDuplicateIDs(dataList) {
  const idSet = new Set()
  for (const item of dataList) {
    if (idSet.has(item.id)) {
      return true
    }
    idSet.add(item.id)
  }
  return false
}

// 그래프 렌더링
function renderChart() {
  barChart.innerHTML = ''
  numberChart.innerHTML = ''

  dataList.forEach((item, i) => {
    const newBar = document.createElement('div')
    const graphHeight = item.value * 2.8
    newBar.innerHTML = `
      <div class='square-bar' style="height: ${graphHeight}px"></div>
    `
    
    const newNumber = document.createElement('div')
    newNumber.innerHTML = `
      <div class='number-text'>${item.id}</div>
    `

    barChart.appendChild(newBar)
    numberChart.appendChild(newNumber)
  })
}

// 고급 편집 렌더링
function renderAdvancedEdit() {
  const formattedData = JSON.stringify(dataList, null, 2)
  editTextbox.value = formattedData
}

// 초기 1회 실행
renderTable()
renderChart()
renderAdvancedEdit()
