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
  isAlertOpen: PropTypes.bool.isRequired,
  onAlertClose: PropTypes.func.isRequired,
  alertHeader: PropTypes.string.isRequired,
  alertBody: PropTypes.string.isRequired,
  actionText: PropTypes.string,
  alertAction: PropTypes.func,
}

export default AlertModal
