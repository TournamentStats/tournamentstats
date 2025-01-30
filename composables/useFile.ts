import type { ModelRef } from 'vue'

/**
 * @description Composable that encapsulates the logic for inputting a single file
 *
 * @param file Ref or Model to bind the file to
 * @param inputElement Element to bind the file input to
 * @param transferElement Element that allows file drag and drop (optional)
 *
 * @returns {handleClick, isDragging} Returns a function to handle the click event and a boolean to indicate if the file is being dragged over the transfer element
 *
 */
export function UseFile(
	file: Ref<File | null> | ModelRef<File | null>,
	inputElement: Ref<HTMLInputElement | null>,
	transferElement?: Ref<HTMLElement | null>,
) {
	const isDragging = ref(false)

	/**
	 * Count to keep track of the number of drags to avoid
	 * isDragging is reset when dragging over children
	 */
	let dragCounter = 0

	function handleClick() {
		if (inputElement.value) {
			inputElement.value.click()
		}
	}

	onMounted(() => {
		if (transferElement?.value) {
			const elm = transferElement.value
			elm.addEventListener('dragenter', (e) => {
				e.preventDefault()
				console.log('dragenterr')
				dragCounter++
				isDragging.value = true
			})

			elm.addEventListener('dragleave', (e) => {
				e.preventDefault()
				console.log('dragleave')
				dragCounter--
				if (dragCounter === 0) {
					isDragging.value = false
				}
			})

			elm.addEventListener('dragover', (e) => {
				e.preventDefault()
			})

			elm.addEventListener('drop', (e) => {
				e.preventDefault()
				dragCounter = 0
				console.log('drope')
				isDragging.value = false
				const files = e.dataTransfer?.files
				if (files?.length) {
					file.value = files[0]
				}
			})
		}

		inputElement.value?.addEventListener('change', (e) => {
			const files = (e.target as HTMLInputElement).files
			if (files?.length) {
				file.value = files[0]
			}
			else {
				file.value = null
			}
		})
	})

	return { handleClick, isDragging }
}
