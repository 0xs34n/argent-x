import { FC } from "react"
import { useNavigate } from "react-router-dom"

import { P } from "../../components/Typography"
import { routes, useReturnTo } from "../../routes"
import { ConfirmScreen } from "../actions/ConfirmScreen"
import { useBackupRequired } from "./backupDownload.state"

export const SeedRecoveryConfirmScreen: FC = () => {
  const navigate = useNavigate()
  const returnTo = useReturnTo()
  return (
    <ConfirmScreen
      title="Have you written down your recovery phrase?"
      switchButtonOrder
      rejectButtonText="No"
      confirmButtonText="Yes"
      onSubmit={() => {
        useBackupRequired.setState({ isBackupRequired: false })
        navigate(returnTo || routes.accountTokens())
      }}
      onReject={() => {
        navigate(-1)
      }}
    >
      <P>
        If you lose your recovery phrase or someone steals it, you will lose
        access to your funds.
      </P>
    </ConfirmScreen>
  )
}
