const payments = {
    all: {
        title: 'Todos los pagos',
        titleTooltip: 'Pantalla para consultar todos los pagos.',
        dialogTitle: 'Pago'
    },
    programed: {
        title: 'Pagos programados',
        titleTooltip: 'Pantalla para consultar los pagos programados.',
        dialogTitle: 'Pago programado'
    },
    executed: {
        title: 'Pagos operados',
        titleTooltip: 'Pantalla para consultar los pagos operados.'
    },
    operatedByCheck: {
        title: "Pagos operados por comprobar",
        titleTooltip: 'Pantalla para consultar los pagos operados pendientes de comprobación.'
    },
    operatedChecked: {
        title: "Pagos operados comprobados",
        titleTooltip: 'Pantalla para consultar los pagos operados que ya fueron comprobados.'
    },
    dialog: {
        payment_status: 'Estatus:',
        payment_statusTooltip: 'Estatus actual del pago.',
        company_trade_name: 'Empresa:',
        company_trade_nameTooltip: 'Empresa que realiza el pago.',
        benef_trade_name: 'Beneficiario:',
        benef_trade_nameTooltip: 'Beneficiario que recibe el pago.',
        folio: 'Folio:',
        folioTooltip: 'Folio del pago.',
        sched_date_n_format: 'F. programado:',
        sched_date_n_formatTooltip: 'Fecha programada para realizar el pago.',
        exec_date_n_format: 'F. ejecutado:',
        exec_date_n_formatTooltip: 'Fecha en la que se realizó el pago.',
        req_date_format: 'F. requerido:',
        req_date_formatTooltip: 'Fecha en la que se solicitó el pago.',
        amount: 'Monto:',
        amountTooltip: 'Monto del pago.',
        currency_code: 'Moneda:',
        currency_codeTooltip: 'Moneda en la que se expresa el monto del pago.',
        exchange_rate_app: 'T. cambio programado:',
        exchange_rate_appTooltip: 'Tipo de cambio programado para el pago.',
        exchange_rate_exec: 'T. cambio ejecutado:',
        exchange_rate_execTooltip: 'Tipo de cambio aplicado al realizar el pago.',
        amount_loc_exec: 'Monto local ejecutado:',
        amount_loc_execTooltip: 'Monto del pago expresado en moneda local.',
        payment_way: 'Método de pago:',
        payment_wayTooltip: 'Método utilizado para realizar el pago.',
        paying_bank: 'Banco ordenante:',
        paying_bankTooltip: 'Banco desde el que se realizó el pago.',
        paying_account: 'Cuenta ordenante:',
        paying_accountTooltip: 'Cuenta desde la que se realizó el pago.',
        benef_bank: 'Banco beneficiario:',
        benef_bankTooltip: 'Banco que recibe el pago.',
        benef_account: 'Cuenta beneficiaria:',
        benef_accountTooltip: 'Cuenta que recibe el pago.',
        payments_entries_title: 'Partidas del pago',
        notes: 'Notas:',
        notesTooltip: 'Notas asociadas al pago.',
        entriesTable: {
            amount: 'Monto',
            currency_code: 'Moneda',
            conv_rate_app: 'Tasa de conversión',
            entry_amount_app: 'Monto en moneda de partida',
            amount_loc_app: 'Monto en moneda local'
        }
    },
    datatable: {
        columns: {
            company_trade_name: 'Empresa',
            folio: 'Folio',
            benef_trade_name: 'Beneficiario',
            currency_name: 'Moneda',
            app_date: 'F. creación',
            req_date: 'F. requerido',
            sched_date_n: 'F. programado',
            exec_date_n: 'F. ejecutado',
            amount: 'Monto',
            payment_way: 'Método de pago',
            payment_status: 'Estatus',
            is_receipt_payment_req: "Requiere CRP",
            crp_folio: "CRP"
        }
    }
}
export default payments