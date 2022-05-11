// prettier-ignore
import { Modal, ModalOverlay, ModalContent, ModalHeader, ModalFooter, ModalBody, ModalCloseButton, Button } from '@chakra-ui/react'
import PropTypes from 'prop-types'

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
          {alertAction && <Button onClick={alertAction}>{actionText}</Button>}
          <Button onClick={onAlertClose} ml="3">
            Close
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  )
}

AlertModal.propTypes = {
  isAlertOpen: PropTypes.bool,
  onAlertClose: PropTypes.func,
  alertHeader: PropTypes.string,
  alertBody: PropTypes.string,
  actionText: PropTypes.string,
  alertAction: PropTypes.func,
}

export default AlertModal
