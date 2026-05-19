import { useState, useCallback, useRef } from 'react';
import { supabase } from '../lib/supabaseClient';

/**
 * useDuplicateCheck — async check for existing mobile/email in athletes table.
 * Returns { checkMobile, checkEmail, mobileError, emailError }
 */
export function useDuplicateCheck() {
  const [mobileError, setMobileError] = useState('');
  const [emailError, setEmailError] = useState('');
  const debounceRef = useRef({});

  const debounce = (key, fn, delay = 600) => {
    if (debounceRef.current[key]) clearTimeout(debounceRef.current[key]);
    debounceRef.current[key] = setTimeout(fn, delay);
  };

  const checkMobile = useCallback((value) => {
    if (!value || value.length !== 10) { setMobileError(''); return; }
    debounce('mobile', async () => {
      const { data } = await supabase
        .from('athletes')
        .select('id')
        .eq('mobile_number', value)
        .maybeSingle();
      setMobileError(data ? 'This mobile number is already registered.' : '');
    });
  }, []);

  const checkEmail = useCallback((value) => {
    if (!value || !value.includes('@')) { setEmailError(''); return; }
    debounce('email', async () => {
      const { data } = await supabase
        .from('athletes')
        .select('id')
        .eq('email', value)
        .maybeSingle();
      setEmailError(data ? 'This email address is already registered.' : '');
    });
  }, []);

  return { checkMobile, checkEmail, mobileError, emailError };
}
