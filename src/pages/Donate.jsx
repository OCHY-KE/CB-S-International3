import React, { useState } from 'react';
import { Phone, Wallet, Loader2, CheckCircle2, AlertCircle } from 'lucide-react';
import styles from '../styles/D.module.css';

const Donate = () => {
  const [phone, setPhone] = useState('');
  const [amount, setAmount] = useState('');
  const [status, setStatus] = useState({ loading: false, msg: '', type: '' });

  const formatPhone = (number) => {
    let cleaned = number.replace(/\D/g, '');
    if (cleaned.startsWith('0')) cleaned = '254' + cleaned.slice(1);
    else if (cleaned.startsWith('7') || cleaned.startsWith('1')) cleaned = '254' + cleaned;
    return cleaned;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus({ loading: true, msg: '', type: '' });

    const formattedPhone = formatPhone(phone);

    if (formattedPhone.length !== 12) {
      setStatus({ 
        loading: false, 
        msg: 'Please use a valid format (e.g., 0712345678)', 
        type: 'error' 
      });
      return;
    }

    try {
      const res = await fetch('https://cccevikzhxeyxsjvomzg.functions.supabase.co/stkPush', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone: formattedPhone, amount }),
      });

      const data = await res.json();

      if (data.ResponseCode === "0") {
        setStatus({ 
          loading: false, 
          msg: 'Prompt sent! Please check your phone to enter your M-Pesa PIN.', 
          type: 'success' 
        });
      } else {
        setStatus({ 
          loading: false, 
          msg: data.errorMessage || 'Transaction failed. Please try again.', 
          type: 'error' 
        });
      }
    } catch (err) {
      setStatus({ 
        loading: false, 
        msg: 'Connection error. Check your internet and try again.', 
        type: 'error' 
      });
    }
  };

  return (
    <div className={styles.wrapper}>
      <div className={styles.donateCard}>
        <div className={styles.header}>
          <div className={styles.iconCircle}>
            <Wallet className={styles.mainIcon} />
          </div>
          <h2 className={styles.title}>Support CbSi Safaris</h2>
          <p className={styles.subtitle}>Fast & Secure M-Pesa Donation</p>
        </div>

        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.inputGroup}>
            <label htmlFor="phone">Phone Number</label>
            <div className={styles.inputWrapper}>
              <Phone className={styles.fieldIcon} size={18} />
              <input
                id="phone"
                type="tel"
                placeholder="0712 345 678"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                required
              />
            </div>
          </div>

          <div className={styles.inputGroup}>
            <label htmlFor="amount">Amount (KES)</label>
            <div className={styles.inputWrapper}>
              <span className={styles.currencyPrefix}>Ksh</span>
              <input
                id="amount"
                type="number"
                placeholder="500"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                required
                min="1"
              />
            </div>
          </div>

          <button 
            type="submit" 
            disabled={status.loading} 
            className={styles.submitBtn}
          >
            {status.loading ? (
              <><Loader2 className={styles.spinner} size={20} /> Processing...</>
            ) : (
              'Donate via M-Pesa'
            )}
          </button>
        </form>

        {status.msg && (
          <div className={`${styles.statusBanner} ${styles[status.type]}`}>
            {status.type === 'success' ? <CheckCircle2 size={18} /> : <AlertCircle size={18} />}
            <span>{status.msg}</span>
          </div>
        )}
        
        <p className={styles.footerNote}>Securely processed via Safaricom Daraja</p>
      </div>
    </div>
  );
};

export default Donate;