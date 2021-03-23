import React from 'react';
import { mergeClasses } from '@magento/venia-ui/lib/classify';
import { shape, string, bool, func } from 'prop-types';
import BillingAddress from '@magento/venia-ui/lib/components/CheckoutPage/BillingAddress';

import { useIdealPayment } from '../../talons/useIdealPayment';
import defaultClasses from './idealPayment.css';
import { FormattedMessage } from 'react-intl';
import Select from '@magento/venia-ui/lib/components/Select';
import {isRequired} from "@magento/venia-ui/lib/util/formValidators";

/**
 *
 * @param props
 * @returns {JSX.Element}
 * @constructor
 */
const IdealPayment = props => {
    const classes = mergeClasses(defaultClasses, props.classes);

    const {
        resetShouldSubmit,
        onPaymentSuccess,
        onPaymentError,
        currentSelectedPaymentMethod,
        paymentIssuers
    } = props;

    const issuers = [];

    const {
        onBillingAddressChangedError,
        onBillingAddressChangedSuccess,
        handleIssuerSelection
    } = useIdealPayment({
        resetShouldSubmit,
        onPaymentSuccess,
        onPaymentError,
        currentSelectedPaymentMethod
    });

    paymentIssuers.map((issuer, index) => (
        issuers.push({
            label: issuer.description,
            value: issuer.code,
            key: issuer.code + index
        })
    ));

    return (
        <div className={classes.root}>
            <Select
                field="multisafepayIdealIssuer"
                items={issuers}
                onValueChange={handleIssuerSelection}
            />
            <p className={classes.note}>
                <FormattedMessage
                    id={'multiSafepayPayment.note'}
                    defaultMessage={
                        'Note: Your will be redirected to the payment page.'
                    }
                />
            </p>
            <BillingAddress
                shouldSubmit={props.shouldSubmit}
                onBillingAddressChangedError={onBillingAddressChangedError}
                onBillingAddressChangedSuccess={onBillingAddressChangedSuccess}
            />
        </div>
    );
};

IdealPayment.propTypes = {
    classes: shape({ root: string }),
    shouldSubmit: bool.isRequired,
    onPaymentSuccess: func,
    onPaymentError: func,
    resetShouldSubmit: func.isRequired
};

export default IdealPayment;
