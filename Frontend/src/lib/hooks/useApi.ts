import { useState } from 'react';
import { getPlan, getQuestions, mockApi } from '../api/backendServices';

export default function useApi() {
  const [loading, setLoading] = useState<boolean>(false);
  const [data, setData] = useState<any>(null);
  const [error, setError] = useState<any>(null);
  const [success, setSuccess] = useState<boolean>(false);

  async function executeApi(type: string, input?: any) {
    if (type === 'mock') {
      setLoading(true);
      setError(null);
      setSuccess(false);

      try {
        const result = await mockApi(input);
        setData(result.data);
        setError(result.error);
        setSuccess(true);
        return result.data;
      } catch (err) {
        setError(err);
        setSuccess(false);
        return null;
      } finally {
        setLoading(false);
      }
    } else if (type === 'getQuestions') {
      setLoading(true);
      setError(null);
      setSuccess(false);
      try {
        const result = await getQuestions(input);
        setData(result.projectId);
        setError(result.error);
        setSuccess(true);
        return result.projectId;
      } catch (err) {
        setError(err);
        setSuccess(false);
        return null;
      } finally {
        setLoading(false);
      }
    } else if (type === 'getPlan') {
      setLoading(true);
      setError(null);
      setSuccess(false);
      try {
        const result = await getPlan(input);
        setData(result);
        setError(result.error);
        setSuccess(true);
        return result;
      } catch (err) {
        setError(err);
        setSuccess(false);
        return null;
      } finally {
        setLoading(false);
      }
    } else {
      setError('Invalid API type');
      setSuccess(false);
      return null;
    }
  }

  return { loading, data, error, success, executeApi };
}
