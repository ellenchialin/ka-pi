import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button,
} from '@chakra-ui/react'

function AlertModal({
  isAlertOpen,
  onAlertClose,
  alertHeader,
  alertBody,
  actionText,
  alertAction,
}) {
  return (
    <Modal onClose={onAlertClose} size="md" isOpen={isAlertOpen} isCentered>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>{alertHeader}</ModalHeader>
        <ModalCloseButton />
        <ModalBody>{alertBody}</ModalBody>
        <ModalFooter>
          <Button onClick={alertAction}>{actionText}</Button>
          <Button onClick={onAlertClose} ml="3">
            Close
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  )
}

export default AlertModal
