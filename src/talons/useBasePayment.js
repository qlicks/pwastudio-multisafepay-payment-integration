import { useCallback, useEffect } from 'react';
import { useQuery, useMutation } from '@apollo/client';
import mergeOperations from '@magento/peregrine/lib/util/shallowMerge';
import { useCartContext } from '@magento/peregrine/lib/context/cart';

import DEFAULT_OPERATIONS from './basePayment.gql';


export const useBasePayment = props => {
    const operations = mergeOperations(DEFAULT_OPERATIONS, props.operations);

    const {
        setPaymentMethodOnCartMutation
    } = operations;

    const [{ cartId }] = useCartContext();
    const { currentSelectedPaymentMethod: selectedMethod  } = props;

    const { resetShouldSubmit, onPaymentSuccess, onPaymentError } = props;

    const [
        updatePaymentMethod,
        {
            error: paymentMethodMutationError,
            called: paymentMethodMutationCalled,
            loading: paymentMethodMutationLoading
        }
    ] = useMutation(setPaymentMethodOnCartMutation);

    /**
     * This function will be called if cant not set address.
     */
    const onBillingAddressChangedError = useCallback(() => {
        resetShouldSubmit();
    }, [resetShouldSubmit]);

    /**
     * This function will be called if address was successfully set.
     */
    const onBillingAddressChangedSuccess = useCallback(() => {
        updatePaymentMethod({
            variables: { cartId, selectedMethod }
        });
    }, [updatePaymentMethod, cartId]);

    useEffect(() => {
        const paymentMethodMutationCompleted =
            paymentMethodMutationCalled && !paymentMethodMutationLoading;

        if (paymentMethodMutationCompleted && !paymentMethodMutationError) {
            onPaymentSuccess();
        }

        if (paymentMethodMutationCompleted && paymentMethodMutationError) {
            onPaymentError();
        }
    }, [
        paymentMethodMutationError,
        paymentMethodMutationLoading,
        paymentMethodMutationCalled,
        onPaymentSuccess,
        onPaymentError,
        resetShouldSubmit
    ]);

    return {
        onBillingAddressChangedError,
        onBillingAddressChangedSuccess
    };
};
