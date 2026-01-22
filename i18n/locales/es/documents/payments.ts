import { title } from "process"

const payments = {
    programed: {
        title: 'Pagos programados',
        titleTooltip: 'Pantalla para consultar los pagos programados',
        dialogTitle: 'Pago programado'
    },
    executed: {
        title: 'Pagos operados',
        titleTooltip: 'Pantalla para consultar los pagos operados'
    },
    operatedByCheck: {
        title: "Pagos operados por comprobar",
        titleTooltip: 'Pantalla para consultar los pagos operados por comprobar'
    },
    operatedChecked: {
        title: "Pagos operados comprobados",
        titleTooltip: 'Pantalla para consultar los pagos operados comprobados'
    },
    dialog: {
        payment_status: 'Estatus',
        payment_statusTooltip: 'Estatus del pago',
        company_trade_name: 'Empresa',
        company_trade_nameTooltip: 'Empresa',
        benef_trade_name: 'Beneficiario',
        benef_trade_nameTooltip: 'Beneficiario del pago',
        folio: 'Folio',
        folioTooltip: 'Folio del pago',
        sched_date_n_format: 'F. programado',
        sched_date_n_formatTooltip: 'Fecha de pago programada',
        exec_date_n_format: 'F. ejecutado',
        exec_date_n_formatTooltip: 'Fecha de pago ejecutado',
        req_date_format: 'F. requerido',
        req_date_formatTooltip: 'Fecha de pago requerida',
        amount: 'Monto',
        amountTooltip: 'Monto',
        currency_code: 'Moneda',
        currency_codeTooltip: 'Moneda del pago',
        exchange_rate_app: 'T. cambio programado',
        exchange_rate_appTooltip: 'Tipo de cambio programado',
        exchange_rate_exec: 'T. cambio ejecutado',
        exchange_rate_execTooltip: 'Tipo cambio ejecutado',
        amount_loc_exec: 'Monto local ejecutado',
        amount_loc_execTooltip: 'Monto local ejecutado',
        payment_way: 'Metodo de pago',
        payment_wayTooltip: 'Metodo de pago',
        paying_bank: 'Banco realiza pago',
        paying_bankTooltip: 'Banco del que se realizó el pago',
        paying_account: 'Cuenta',
        paying_accountTooltip: 'Cuenta de la que se realizó el pago',
        benef_bank: 'Banco recibe pago',
        benef_bankTooltip: 'Banco que recibe el pago',
        benef_account: 'Cuenta recibe',
        benef_accountTooltip: 'Cuenta que recibe el pago',
        notes: 'Notas',
        notesTooltip: 'Notas del pago',
        entriesTable: {
            amount: 'Monto',
            currency_code: 'Moneda',
            conv_rate_app: 'Taza de conversión',
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
            payment_way: 'Metodo de pago',
            payment_status: 'Estatus',
            is_receipt_payment_req: "Requiere CRP",
            crp_folio: "CRP"
        }
    }
}

export default payments